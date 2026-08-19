export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import {
  getSession,
  getSessionUser,
  getSessionCookieValue,
  sessionCookieClearOptions,
} from '@/lib/auth';

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
    return NextResponse.json(
      {
        user: safeUser,
        totpVerified: user.totpEnabled ? getSession(token)?.totpVerified ?? false : true,
      },
      { headers: NO_STORE }
    );
  } catch (error) {
    console.error('Auth me error:', error);
    // 500, not a null user: a transient server fault must not be reported to the
    // client as "logged out", or the admin UI bounces to the login screen.
    return NextResponse.json(
      { error: 'Lỗi kiểm tra phiên đăng nhập' },
      { status: 500, headers: NO_STORE }
    );
  }
}
