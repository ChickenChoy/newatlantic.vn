/**
 * @jest-environment node
 *
 * Regression tests for the admin session cookie.
 *
 * The bug these guard against: `secure` was derived from `NODE_ENV === 'production'`
 * instead of from the request protocol. On a plain-HTTP production deployment the
 * browser silently DISCARDS a `Secure` cookie, so login returned 200 (the UI entered
 * the panel from the response body) but no session was ever stored — every reload
 * bounced back to the login screen and every write returned 401.
 */

import {
  isSecureRequest,
  sessionCookieSetOptions,
  sessionCookieClearOptions,
  SESSION_COOKIE_NAME,
} from '@/lib/auth';

const req = (init: {
  proto?: string;
  nextUrlProtocol?: string;
  url?: string;
}) => ({
  headers: new Headers(init.proto ? { 'x-forwarded-proto': init.proto } : {}),
  ...(init.nextUrlProtocol ? { nextUrl: { protocol: init.nextUrlProtocol } } : {}),
  ...(init.url ? { url: init.url } : {}),
});

describe('isSecureRequest', () => {
  it('trusts x-forwarded-proto=https (TLS-terminating proxy)', () => {
    expect(isSecureRequest(req({ proto: 'https' }))).toBe(true);
  });

  it('honours only the client-facing hop of a proxy chain', () => {
    expect(isSecureRequest(req({ proto: 'https, http' }))).toBe(true);
    expect(isSecureRequest(req({ proto: 'http, https' }))).toBe(false);
  });

  it('is case- and whitespace-insensitive', () => {
    expect(isSecureRequest(req({ proto: '  HTTPS  ' }))).toBe(true);
  });

  it('falls back to nextUrl.protocol when no forwarded header is present', () => {
    expect(isSecureRequest(req({ nextUrlProtocol: 'https:' }))).toBe(true);
    expect(isSecureRequest(req({ nextUrlProtocol: 'http:' }))).toBe(false);
  });

  it('falls back to the request url as a last resort', () => {
    expect(isSecureRequest(req({ url: 'https://example.com/api/auth' }))).toBe(true);
    expect(isSecureRequest(req({ url: 'http://example.com/api/auth' }))).toBe(false);
  });

  it('does not throw on an unparseable url', () => {
    expect(isSecureRequest(req({ url: 'not-a-url' }))).toBe(false);
  });

  it('is false when there is no request to inspect', () => {
    expect(isSecureRequest(undefined)).toBe(false);
  });
});

describe('sessionCookieSetOptions', () => {
  const ORIGINAL_ENV = process.env.NODE_ENV;

  afterEach(() => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: ORIGINAL_ENV,
      configurable: true,
    });
  });

  const setNodeEnv = (value: string) =>
    Object.defineProperty(process.env, 'NODE_ENV', { value, configurable: true });

  it('omits Secure on plain HTTP even in production (the regression)', () => {
    setNodeEnv('production');
    const { options } = sessionCookieSetOptions('tok', req({ nextUrlProtocol: 'http:' }));
    expect(options.secure).toBe(false);
  });

  it('sets Secure on HTTPS in production', () => {
    setNodeEnv('production');
    const { options } = sessionCookieSetOptions('tok', req({ proto: 'https' }));
    expect(options.secure).toBe(true);
  });

  it('sets Secure on HTTPS even in development', () => {
    setNodeEnv('development');
    const { options } = sessionCookieSetOptions('tok', req({ proto: 'https' }));
    expect(options.secure).toBe(true);
  });

  it('carries the token and hardening flags', () => {
    const { name, value, options } = sessionCookieSetOptions('tok-123', req({ proto: 'https' }));
    expect(name).toBe(SESSION_COOKIE_NAME);
    expect(value).toBe('tok-123');
    expect(options.httpOnly).toBe(true);
    expect(options.sameSite).toBe('lax');
    expect(options.path).toBe('/');
    expect(options.maxAge).toBe(7 * 24 * 60 * 60);
  });
});

describe('sessionCookieClearOptions', () => {
  it('mirrors the set flags so the browser actually overwrites the cookie', () => {
    for (const request of [req({ proto: 'https' }), req({ nextUrlProtocol: 'http:' })]) {
      const set = sessionCookieSetOptions('tok', request);
      const clear = sessionCookieClearOptions(request);

      // A mismatched Secure/SameSite/Path makes this a *different* cookie, and the
      // original would survive logout.
      expect(clear.name).toBe(set.name);
      expect(clear.options.secure).toBe(set.options.secure);
      expect(clear.options.sameSite).toBe(set.options.sameSite);
      expect(clear.options.path).toBe(set.options.path);
      expect(clear.options.httpOnly).toBe(set.options.httpOnly);
    }
  });

  it('expires the cookie immediately', () => {
    const clear = sessionCookieClearOptions(req({ proto: 'https' }));
    expect(clear.value).toBe('');
    expect(clear.options.maxAge).toBe(0);
  });
});
