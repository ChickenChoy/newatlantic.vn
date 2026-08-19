export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/users';
import {
  verifyPasswordSync,
  createSession,
  getSession,
  getSessionUser,
  destroySession,
  getSessionCookieValue,
  sessionCookieSetOptions,
  sessionCookieClearOptions,
  setSessionTotpVerified,
} from '@/lib/auth';
import { logActivity } from '@/lib/activity-logs';

// The session probe must never be served from a cache: a cached `{user:null}`
// (or a cached authenticated body) is indistinguishable from a real answer and
// causes phantom logouts on reload.
const NO_STORE = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  Pragma: 'no-cache',
} as const;

// GET /api/auth/me - return current session user (without passwordHash)
export async function GET(request: NextRequest) {
  try {
    const token = getSessionCookieValue(request);
    if (!token) {
      return NextResponse.json({ user: null, totpVerified: false }, { headers: NO_STORE });
    }

    const user = await getSessionUser(token);
    if (!user) {
      const res = NextResponse.json({ user: null, totpVerified: false }, { headers: NO_STORE });
      const clear = sessionCookieClearOptions(request);
      res.cookies.set({ name: clear.name, value: clear.value, ...clear.options });
      return res;
    }

    const { passwordHash, ...safeUser } = user;
    return NextResponse.json({
      user: safeUser,
      totpVerified: user.totpEnabled ? getSession(token)?.totpVerified ?? false : true,
    }, { headers: NO_STORE });
  } catch (error) {
    console.error('Auth me error:', error);
    // 500, not a null user: a transient server fault must not be reported to the
    // client as "logged out", or the admin UI bounces to the login screen.
    return NextResponse.json({ error: 'Lỗi kiểm tra phiên đăng nhập' }, { status: 500, headers: NO_STORE });
  }
}

// POST /api/auth - login / logout / verify-totp
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'login') {
      const { email, password } = body as { email?: string; password?: string };

      if (!email || !password) {
        return NextResponse.json({ error: 'Thiếu email hoặc mật khẩu' }, { status: 400 });
      }

      const user = await getUserByEmail(email);
      if (!user || !user.isActive) {
        return NextResponse.json({ error: 'Email hoặc mật khẩu không đúng' }, { status: 401 });
      }

      if (!user.passwordHash) {
        return NextResponse.json({ error: 'Tài khoản chưa thiết lập mật khẩu' }, { status: 401 });
      }

      const valid = verifyPasswordSync(password, user.passwordHash);
      if (!valid) {
        await logActivity({
          action: 'login',
          entity: 'auth',
          entityName: email,
          user: email,
          details: 'Đăng nhập thất bại',
        });
        return NextResponse.json({ error: 'Email hoặc mật khẩu không đúng' }, { status: 401 });
      }

      const totpVerified = !user.totpEnabled;
      const token = createSession(user, totpVerified);

      await logActivity({
        action: 'login',
        entity: 'auth',
        entityId: user.id,
        entityName: user.email,
        user: user.email,
        details: `Đăng nhập thành công${user.totpEnabled ? ' - chờ xác thực 2FA' : ''}`,
      });

      const { passwordHash, ...safeUser } = user;
      const set = sessionCookieSetOptions(token, request);
      const res = NextResponse.json({ user: safeUser, totpVerified, token });
      res.cookies.set({ name: set.name, value: set.value, ...set.options });
      return res;
    }

    if (action === 'logout') {
      const token = getSessionCookieValue(request);
      if (token) destroySession(token);

      const clear = sessionCookieClearOptions(request);
      const res = NextResponse.json({ success: true });
      res.cookies.set({ name: clear.name, value: clear.value, ...clear.options });
      return res;
    }

    if (action === 'verify-totp') {
      const token = getSessionCookieValue(request);
      if (!token) {
        return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
      }

      setSessionTotpVerified(token);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Auth POST error:', error);
    return NextResponse.json({ error: 'Lỗi xử lý xác thực' }, { status: 500 });
  }
}
