import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { authenticator } from '@otplib/preset-default';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

interface TotpSettingsValue {
  totp_enabled?: boolean;
  totp_secret?: string | null;
  updated_at?: string;
}

const SECURITY_KEY_PREFIX = 'security:';
const DATA_DIR = path.join(process.cwd(), 'data');
const TOTP_FILE = path.join(DATA_DIR, 'totp-settings.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readLocalTotpSettings(userEmail: string): TotpSettingsValue {
  try {
    if (!fs.existsSync(TOTP_FILE)) return {};
    const data = JSON.parse(fs.readFileSync(TOTP_FILE, 'utf-8')) as Record<string, TotpSettingsValue>;
    return data[normalizeUserEmail(userEmail)] || {};
  } catch {
    return {};
  }
}

function writeLocalTotpSettings(userEmail: string, value: TotpSettingsValue): void {
  ensureDataDir();
  let data: Record<string, TotpSettingsValue> = {};
  try {
    if (fs.existsSync(TOTP_FILE)) {
      data = JSON.parse(fs.readFileSync(TOTP_FILE, 'utf-8')) as Record<string, TotpSettingsValue>;
    }
  } catch {
    data = {};
  }

  data[normalizeUserEmail(userEmail)] = value;
  fs.writeFileSync(TOTP_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function normalizeUserEmail(userEmail: string): string {
  return userEmail.trim().toLowerCase();
}

function getSecurityKeyForUser(userEmail: string): string {
  return `${SECURITY_KEY_PREFIX}${normalizeUserEmail(userEmail)}`;
}

async function syncUserTotpStatus(client: SupabaseClient, userEmail: string | undefined, enabled: boolean): Promise<void> {
  if (!userEmail) return;

  const { error } = await client
    .from('admin_users')
    .update({
      totp_enabled: enabled,
      updated_at: new Date().toISOString(),
    })
    .ilike('email', normalizeUserEmail(userEmail));

  if (error) {
    // Non-blocking: TOTP core flow should continue even if metadata sync fails
    console.warn(`Failed to sync user 2FA status for ${userEmail}:`, error.message);
  }
}

// Lazy-loaded Supabase client for server-side
let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase credentials not configured. TOTP features will be disabled.');
    return null;
  }

  supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
  return supabaseClient;
}

// Helper to get Supabase URL for auth client
function getSupabaseUrl(): string | null {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || null;
}

function generateSecret(): string {
  return authenticator.generateSecret();
}

function verifyTOTP(secret: string, token: string): boolean {
  return authenticator.verify({ token, secret });
}

function generateKeyUri(email: string, issuer: string, secret: string): string {
  return authenticator.keyuri(email, issuer, secret);
}

async function readTotpSettings(client: SupabaseClient, userEmail: string): Promise<TotpSettingsValue> {
  const { data, error } = await client
    .from('admin_settings')
    .select('value')
    .eq('key', getSecurityKeyForUser(userEmail))
    .maybeSingle();

  if (error) {
    console.error('Error reading TOTP settings:', error);
    return {};
  }

  const value = data?.value;
  if (!value || typeof value !== 'object') return {};
  return value as TotpSettingsValue;
}

async function writeTotpSettings(client: SupabaseClient, userEmail: string, value: TotpSettingsValue): Promise<string | null> {
  const { error } = await client
    .from('admin_settings')
    .upsert({
      key: getSecurityKeyForUser(userEmail),
      value,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'key' });

  return error ? error.message : null;
}

// GET - Check TOTP status
export async function GET(request: NextRequest) {
  try {
    const client = getSupabaseClient();
    if (!client) {
      const userEmail = request.nextUrl.searchParams.get('userEmail') || request.headers.get('x-user-email');
      const settings = userEmail ? readLocalTotpSettings(userEmail) : {};
      return NextResponse.json({ totpEnabled: settings.totp_enabled || false });
    }

    const userEmail = request.nextUrl.searchParams.get('userEmail') || request.headers.get('x-user-email');
    if (!userEmail) {
      return NextResponse.json({ totpEnabled: false });
    }

    const normalizedEmail = normalizeUserEmail(userEmail);
    const settings = await readTotpSettings(client, normalizedEmail);

    await syncUserTotpStatus(client, normalizedEmail, Boolean(settings.totp_enabled));

    return NextResponse.json({
      totpEnabled: settings.totp_enabled || false,
    });
  } catch (error) {
    console.error('Error getting TOTP status:', error);
    return NextResponse.json({ totpEnabled: false });
  }
}

// POST - Setup, verify, or disable TOTP
export async function POST(request: NextRequest) {
  try {
    const client = getSupabaseClient();
    const supabaseUrl = getSupabaseUrl();

    const body = await request.json();
    const { action, token } = body;

    if (!client || !supabaseUrl) {
      const { userEmail } = body as { userEmail?: string };
      const normalizedEmail = normalizeUserEmail(userEmail || 'admin@newatlantic.vn');

      switch (action) {
        case 'setup': {
          const secret = generateSecret();
          const otpauth = generateKeyUri(normalizedEmail, 'NewAtlantic Admin', secret);
          const qrCodeDataUrl = await QRCode.toDataURL(otpauth);
          writeLocalTotpSettings(normalizedEmail, {
            totp_secret: secret,
            totp_enabled: false,
            updated_at: new Date().toISOString(),
          });
          return NextResponse.json({
            success: true,
            secret,
            qrCode: qrCodeDataUrl,
            message: 'Quét mã QR bằng Google Authenticator, sau đó nhập mã xác thực để hoàn tất.',
          });
        }

        case 'verify-setup': {
          const settings = readLocalTotpSettings(normalizedEmail);
          if (!settings.totp_secret) return NextResponse.json({ error: 'Chưa thiết lập TOTP' }, { status: 400 });
          if (!verifyTOTP(settings.totp_secret, token)) return NextResponse.json({ error: 'Mã xác thực không đúng' }, { status: 400 });
          writeLocalTotpSettings(normalizedEmail, {
            ...settings,
            totp_enabled: true,
            updated_at: new Date().toISOString(),
          });
          return NextResponse.json({ success: true, message: 'Đã kích hoạt Google Authenticator thành công!' });
        }

        case 'verify': {
          const settings = readLocalTotpSettings(normalizedEmail);
          if (!settings.totp_enabled || !settings.totp_secret) return NextResponse.json({ success: true });
          if (!verifyTOTP(settings.totp_secret, token)) return NextResponse.json({ error: 'Mã xác thực không đúng' }, { status: 400 });
          return NextResponse.json({ success: true, message: 'Xác thực thành công!' });
        }

        case 'disable': {
          const settings = readLocalTotpSettings(normalizedEmail);
          if (settings.totp_enabled && settings.totp_secret && token && !verifyTOTP(settings.totp_secret, token)) {
            return NextResponse.json({ error: 'Mã xác thực không đúng' }, { status: 400 });
          }
          writeLocalTotpSettings(normalizedEmail, {
            ...settings,
            totp_enabled: false,
            totp_secret: null,
            updated_at: new Date().toISOString(),
          });
          return NextResponse.json({ success: true, message: 'Đã tắt Google Authenticator thành công!' });
        }

        default:
          return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
      }
    }

    switch (action) {
      case 'setup': {
        try {
          const { password, userEmail } = body;

          if (!password) {
            return NextResponse.json({ error: 'Vui lòng nhập mật khẩu' }, { status: 400 });
          }

          if (!userEmail) {
            return NextResponse.json({ error: 'Thiếu thông tin người dùng' }, { status: 400 });
          }

          const normalizedEmail = normalizeUserEmail(userEmail);

          const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
          if (!supabaseAnonKey) {
            return NextResponse.json({ error: 'Supabase anon key not configured' }, { status: 503 });
          }

          const { createClient: createAnonClient } = await import('@supabase/supabase-js');
          const supabaseAuth = createAnonClient(supabaseUrl, supabaseAnonKey);

          const { error: authError } = await supabaseAuth.auth.signInWithPassword({
            email: normalizedEmail,
            password,
          });

          if (authError) {
            console.error('Password verification failed:', authError.message);
            return NextResponse.json({ error: 'Mật khẩu không đúng' }, { status: 401 });
          }

          const secret = generateSecret();
          const otpauth = generateKeyUri(normalizedEmail, 'NewAtlantic Admin', secret);
          const qrCodeDataUrl = await QRCode.toDataURL(otpauth);

          const currentSettings = await readTotpSettings(client, normalizedEmail);
          const writeError = await writeTotpSettings(client, normalizedEmail, {
            ...currentSettings,
            totp_secret: secret,
            totp_enabled: false,
            updated_at: new Date().toISOString(),
          });

          if (writeError) {
            return NextResponse.json({ error: `Không thể lưu cài đặt: ${writeError}` }, { status: 500 });
          }

          await syncUserTotpStatus(client, normalizedEmail, false);

          return NextResponse.json({
            success: true,
            secret,
            qrCode: qrCodeDataUrl,
            message: 'Quét mã QR bằng Google Authenticator, sau đó nhập mã xác thực để hoàn tất.',
          });
        } catch (setupError) {
          console.error('Setup error:', setupError);
          return NextResponse.json({ error: `Lỗi setup: ${String(setupError)}` }, { status: 500 });
        }
      }

      case 'verify-setup': {
        const { userEmail } = body as { userEmail?: string };
        if (!userEmail) {
          return NextResponse.json({ error: 'Thiếu thông tin người dùng' }, { status: 400 });
        }

        const normalizedEmail = normalizeUserEmail(userEmail);
        const settings = await readTotpSettings(client, normalizedEmail);
        if (!settings.totp_secret) {
          return NextResponse.json({ error: 'Chưa thiết lập TOTP' }, { status: 400 });
        }

        const isValid = verifyTOTP(settings.totp_secret, token);
        if (!isValid) {
          return NextResponse.json({ error: 'Mã xác thực không đúng' }, { status: 400 });
        }

        const writeError = await writeTotpSettings(client, normalizedEmail, {
          ...settings,
          totp_enabled: true,
          updated_at: new Date().toISOString(),
        });

        if (writeError) {
          return NextResponse.json({ error: 'Không thể kích hoạt TOTP' }, { status: 500 });
        }

        await syncUserTotpStatus(client, normalizedEmail, true);

        return NextResponse.json({
          success: true,
          message: 'Đã kích hoạt Google Authenticator thành công!',
        });
      }

      case 'verify': {
        const { userEmail } = body as { userEmail?: string };
        if (!userEmail) {
          return NextResponse.json({ error: 'Thiếu thông tin người dùng' }, { status: 400 });
        }

        const normalizedEmail = normalizeUserEmail(userEmail);
        const settings = await readTotpSettings(client, normalizedEmail);
        if (!settings.totp_enabled || !settings.totp_secret) {
          return NextResponse.json({ error: 'TOTP chưa được kích hoạt' }, { status: 400 });
        }

        const isValid = verifyTOTP(settings.totp_secret, token);
        if (!isValid) {
          return NextResponse.json({ error: 'Mã xác thực không đúng' }, { status: 400 });
        }

        return NextResponse.json({
          success: true,
          message: 'Xác thực thành công!',
        });
      }

      case 'disable': {
        const { password, userEmail } = body;

        if (!password) {
          return NextResponse.json({ error: 'Vui lòng nhập mật khẩu' }, { status: 400 });
        }

        if (!userEmail) {
          return NextResponse.json({ error: 'Thiếu thông tin người dùng' }, { status: 400 });
        }

        const normalizedEmail = normalizeUserEmail(userEmail);

        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseAnonKey) {
          return NextResponse.json({ error: 'Supabase anon key not configured' }, { status: 503 });
        }

        const { createClient: createAnonClient } = await import('@supabase/supabase-js');
        const supabaseAuth = createAnonClient(supabaseUrl, supabaseAnonKey);

        const { error: authError } = await supabaseAuth.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (authError) {
          console.error('Password verification failed:', authError.message);
          return NextResponse.json({ error: 'Mật khẩu không đúng' }, { status: 401 });
        }

        const settings = await readTotpSettings(client, normalizedEmail);

        if (settings.totp_enabled && settings.totp_secret) {
          const isValid = verifyTOTP(settings.totp_secret, token);
          if (!isValid) {
            return NextResponse.json({ error: 'Mã xác thực không đúng' }, { status: 400 });
          }
        }

        const writeError = await writeTotpSettings(client, normalizedEmail, {
          ...settings,
          totp_enabled: false,
          totp_secret: null,
          updated_at: new Date().toISOString(),
        });

        if (writeError) {
          return NextResponse.json({ error: 'Không thể tắt TOTP' }, { status: 500 });
        }

        await syncUserTotpStatus(client, normalizedEmail, false);

        return NextResponse.json({
          success: true,
          message: 'Đã tắt Google Authenticator thành công!',
        });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing TOTP request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
