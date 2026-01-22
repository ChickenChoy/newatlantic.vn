import { NextRequest, NextResponse } from 'next/server';
import { generateSecret, generateURI, verifySync } from 'otplib';
import QRCode from 'qrcode';
import { getAdminSettings, saveAdminSettings } from '@/lib/db';

const ADMIN_PASSWORD = '@Tandaitayduong';
const ISSUER = 'NewAtlantic Admin';
const ACCOUNT_NAME = 'admin@newatlantic.vn';

// GET - Check TOTP status
export async function GET() {
  try {
    const settings = getAdminSettings();
    return NextResponse.json({
      totpEnabled: settings.totpEnabled,
      totpVerified: settings.totpVerified,
    });
  } catch (error) {
    console.error('Error getting TOTP status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to verify TOTP token
function verifyToken(token: string, secret: string): boolean {
  const result = verifySync({ token, secret });
  return result.valid;
}

// POST - Setup, verify, or disable TOTP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, password, token } = body;

    // Verify admin password for setup and disable actions
    if ((action === 'setup' || action === 'disable') && password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Mật khẩu không đúng' }, { status: 401 });
    }

    const settings = getAdminSettings();

    switch (action) {
      case 'setup': {
        // Generate new secret
        const secret = generateSecret();
        const otpauth = generateURI({
          issuer: ISSUER,
          label: ACCOUNT_NAME,
          secret,
          algorithm: 'sha1',
          digits: 6,
          period: 30,
        });

        // Generate QR code as data URL
        const qrCodeDataUrl = await QRCode.toDataURL(otpauth);

        // Save secret but don't enable yet (need verification first)
        settings.totpSecret = secret;
        settings.totpVerified = false;
        saveAdminSettings(settings);

        return NextResponse.json({
          success: true,
          secret,
          qrCode: qrCodeDataUrl,
          message: 'Quét mã QR bằng ứng dụng Google Authenticator, sau đó nhập mã xác thực để hoàn tất thiết lập.',
        });
      }

      case 'verify-setup': {
        // Verify token and enable TOTP
        if (!settings.totpSecret) {
          return NextResponse.json({ error: 'Chưa thiết lập TOTP' }, { status: 400 });
        }

        const isValid = verifyToken(token, settings.totpSecret);
        if (!isValid) {
          return NextResponse.json({ error: 'Mã xác thực không đúng' }, { status: 400 });
        }

        settings.totpEnabled = true;
        settings.totpVerified = true;
        saveAdminSettings(settings);

        return NextResponse.json({
          success: true,
          message: 'Đã kích hoạt Google Authenticator thành công!',
        });
      }

      case 'verify': {
        // Verify token for login
        if (!settings.totpEnabled || !settings.totpSecret) {
          return NextResponse.json({ error: 'TOTP chưa được kích hoạt' }, { status: 400 });
        }

        const isValid = verifyToken(token, settings.totpSecret);
        if (!isValid) {
          return NextResponse.json({ error: 'Mã xác thực không đúng' }, { status: 400 });
        }

        return NextResponse.json({
          success: true,
          message: 'Xác thực thành công!',
        });
      }

      case 'disable': {
        // Verify token before disabling
        if (settings.totpEnabled && settings.totpSecret) {
          const isValid = verifyToken(token, settings.totpSecret);
          if (!isValid) {
            return NextResponse.json({ error: 'Mã xác thực không đúng' }, { status: 400 });
          }
        }

        settings.totpEnabled = false;
        settings.totpSecret = null;
        settings.totpVerified = false;
        saveAdminSettings(settings);

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
