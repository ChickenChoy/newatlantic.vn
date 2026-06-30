import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { getUserByEmail } from './users';
import type { StoredAdminUser } from '@/types';

export const SESSION_COOKIE_NAME = 'na_admin_session';
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const DATA_DIR = process.env.PERSISTENT_DATA_PATH
  ? path.resolve(process.env.PERSISTENT_DATA_PATH)
  : path.join(process.cwd(), 'data');
const SESSIONS_FILE = path.join(DATA_DIR, 'admin-sessions.json');

export interface AdminSession {
  token: string;
  userId: string;
  email: string;
  totpVerified: boolean;
  createdAt: string;
  expiresAt: string;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readSessions(): AdminSession[] {
  try {
    if (!fs.existsSync(SESSIONS_FILE)) return [];
    const raw = fs.readFileSync(SESSIONS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSessions(sessions: AdminSession[]): void {
  ensureDataDir();
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
}

function dropExpiredSessions(): void {
  const sessions = readSessions();
  const now = Date.now();
  const valid = sessions.filter(s => new Date(s.expiresAt).getTime() > now);
  if (valid.length !== sessions.length) writeSessions(valid);
}

// Password hashing with scrypt (sync because login volume is very low)
export function hashPasswordSync(password: string): string {
  const salt = crypto.randomBytes(16).toString('base64');
  const key = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt}$${key.toString('base64')}`;
}

export function verifyPasswordSync(password: string, hash: string): boolean {
  const parts = hash.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const salt = parts[1];
  const key = parts[2];
  try {
    const derived = crypto.scryptSync(password, salt, 64);
    return derived.toString('base64') === key;
  } catch {
    return false;
  }
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function createSession(user: StoredAdminUser, totpVerified = false): string {
  dropExpiredSessions();
  const sessions = readSessions();
  const now = Date.now();
  const token = generateSessionToken();
  const session: AdminSession = {
    token,
    userId: user.id,
    email: user.email,
    totpVerified,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + SESSION_MAX_AGE_MS).toISOString(),
  };
  sessions.push(session);
  writeSessions(sessions);
  return token;
}

export function getSession(token: string): AdminSession | null {
  if (!token) return null;
  dropExpiredSessions();
  const sessions = readSessions();
  const session = sessions.find(s => s.token === token);
  if (!session || new Date(session.expiresAt).getTime() <= Date.now()) return null;
  return session;
}

export async function getSessionUser(token: string): Promise<StoredAdminUser | null> {
  const session = getSession(token);
  if (!session) return null;
  const user = await getUserByEmail(session.email);
  if (!user || !user.isActive) return null;
  return user;
}

export function setSessionTotpVerified(token: string): void {
  const sessions = readSessions();
  const idx = sessions.findIndex(s => s.token === token);
  if (idx !== -1) {
    sessions[idx].totpVerified = true;
    writeSessions(sessions);
  }
}

export function destroySession(token: string): void {
  dropExpiredSessions();
  const sessions = readSessions();
  writeSessions(sessions.filter(s => s.token !== token));
}

export function destroyAllUserSessions(userId: string): void {
  dropExpiredSessions();
  const sessions = readSessions();
  writeSessions(sessions.filter(s => s.userId !== userId));
}

export function getSessionCookieValue(
  request: {
    cookies?: { get(name: string): { value: string } | undefined };
    headers?: Headers;
  }
): string | null {
  if (request.cookies?.get) {
    const cookie = request.cookies.get(SESSION_COOKIE_NAME);
    return cookie?.value || null;
  }
  const cookieHeader = request.headers?.get('cookie');
  if (!cookieHeader) return null;
  const entries = cookieHeader.split(';');
  const match = entries.find(c => {
    const idx = c.indexOf('=');
    if (idx === -1) return false;
    return c.slice(0, idx).trim() === SESSION_COOKIE_NAME;
  });
  if (!match) return null;
  const value = match.split('=').slice(1).join('=').trim();
  return value ? decodeURIComponent(value) : null;
}

export interface SessionCookieOptions {
  name: string;
  value: string;
  options: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'lax' | 'strict' | 'none';
    path: string;
    maxAge: number;
  };
}

export function sessionCookieSetOptions(token: string): SessionCookieOptions {
  return {
    name: SESSION_COOKIE_NAME,
    value: token,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: Math.floor(SESSION_MAX_AGE_MS / 1000),
    },
  };
}

export function sessionCookieClearOptions(): SessionCookieOptions {
  return {
    name: SESSION_COOKIE_NAME,
    value: '',
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    },
  };
}
