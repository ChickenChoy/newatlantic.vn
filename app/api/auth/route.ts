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

// GET /api/auth/me - return current session user (without passwordHash)
export async function GET(request: NextRequest) {
  try {
    const token = getSessionCookieValue(request);
    if (!token) {
      return NextResponse.json({ user: null, totpVerified: false });
    }

    const user = await getSessionUser(token);
    if (!user) {
      const res = NextResponse.json({ user: null, totpVerified: false });
      const clear = sessionCookieClearOptions();
      res.cookies.set({ name: clear.name, value: clear.value, ...clear.options });
      return res;
    }

    const { passwordHash, ...safeUser } = user;
    return NextResponse.json({
      user: safeUser,
      totpVerified: user.totpEnabled ? getSession(token)?.totpVerified ?? false : true,
    });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ user: null, totpVerified: false });
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
      const set = sessionCookieSetOptions(token);
      const res = NextResponse.json({ user: safeUser, totpVerified, token });
      res.cookies.set({ name: set.name, value: set.value, ...set.options });
      return res;
    }

    if (action === 'logout') {
      const token = getSessionCookieValue(request);
      if (token) destroySession(token);

      const clear = sessionCookieClearOptions();
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
