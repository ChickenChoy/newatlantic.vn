export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import {
  getSession,
  getSessionUser,
  getSessionCookieValue,
  sessionCookieClearOptions,
} from '@/lib/auth';

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
