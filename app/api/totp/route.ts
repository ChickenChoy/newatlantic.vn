import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { authenticator } from '@otplib/preset-default';
import QRCode from 'qrcode';

// Use service role key for database operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper functions using otplib
function generateSecret(): string {
  return authenticator.generateSecret();
}

function verifyTOTP(secret: string, token: string): boolean {
  return authenticator.verify({ token, secret });
}

function generateKeyUri(email: string, issuer: string, secret: string): string {
  return authenticator.keyuri(email, issuer, secret);
}

// GET - Check TOTP status
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('totp_enabled')
      .eq('id', 'admin')
      .single();

    if (error) {
      console.error('Error getting TOTP status:', error);
      return NextResponse.json({ totpEnabled: false });
    }

    return NextResponse.json({
      totpEnabled: data?.totp_enabled || false,
    });
  } catch (error) {
    console.error('Error getting TOTP status:', error);
    return NextResponse.json({ totpEnabled: false });
  }
}

// POST - Setup, verify, or disable TOTP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, token } = body;

    switch (action) {
      case 'setup': {
        try {
          // Generate new secret
          const secret = generateSecret();
          console.log('Generated secret:', secret);

          const otpauth = generateKeyUri('admin@newatlantic.vn', 'NewAtlantic Admin', secret);
          console.log('Generated otpauth:', otpauth);

          // Generate QR code
          const qrCodeDataUrl = await QRCode.toDataURL(otpauth);
          console.log('Generated QR code');

          // Save secret but don't enable yet
          const { error } = await supabase
            .from('admin_settings')
            .upsert({
              id: 'admin',
              totp_secret: secret,
              totp_enabled: false,
              updated_at: new Date().toISOString(),
            });

          if (error) {
            console.error('Error saving TOTP secret:', error);
            return NextResponse.json({ error: 'Không thể lưu cài đặt: ' + error.message }, { status: 500 });
          }

          return NextResponse.json({
            success: true,
            secret,
            qrCode: qrCodeDataUrl,
            message: 'Quét mã QR bằng Google Authenticator, sau đó nhập mã xác thực để hoàn tất.',
          });
        } catch (setupError) {
          console.error('Setup error:', setupError);
          return NextResponse.json({ error: 'Lỗi setup: ' + String(setupError) }, { status: 500 });
        }
      }

      case 'verify-setup': {
        // Get secret from database
        const { data, error: fetchError } = await supabase
          .from('admin_settings')
          .select('totp_secret')
          .eq('id', 'admin')
          .single();

        if (fetchError || !data?.totp_secret) {
          return NextResponse.json({ error: 'Chưa thiết lập TOTP' }, { status: 400 });
        }

        // Verify token
        const isValid = verifyTOTP(data.totp_secret, token);
        if (!isValid) {
          return NextResponse.json({ error: 'Mã xác thực không đúng' }, { status: 400 });
        }

        // Enable TOTP
        const { error: updateError } = await supabase
          .from('admin_settings')
          .update({ totp_enabled: true, updated_at: new Date().toISOString() })
          .eq('id', 'admin');

        if (updateError) {
          return NextResponse.json({ error: 'Không thể kích hoạt TOTP' }, { status: 500 });
        }

        return NextResponse.json({
          success: true,
          message: 'Đã kích hoạt Google Authenticator thành công!',
        });
      }

      case 'verify': {
        // Get settings
        const { data, error: fetchError } = await supabase
          .from('admin_settings')
          .select('totp_secret, totp_enabled')
          .eq('id', 'admin')
          .single();

        if (fetchError || !data?.totp_enabled || !data?.totp_secret) {
          return NextResponse.json({ error: 'TOTP chưa được kích hoạt' }, { status: 400 });
        }

        // Verify token
        const isValid = verifyTOTP(data.totp_secret, token);
        if (!isValid) {
          return NextResponse.json({ error: 'Mã xác thực không đúng' }, { status: 400 });
        }

        return NextResponse.json({
          success: true,
          message: 'Xác thực thành công!',
        });
      }

      case 'disable': {
        // Get settings
        const { data, error: fetchError } = await supabase
          .from('admin_settings')
          .select('totp_secret, totp_enabled')
          .eq('id', 'admin')
          .single();

        if (fetchError) {
          return NextResponse.json({ error: 'Không thể đọc cài đặt' }, { status: 500 });
        }

        // Verify token before disabling
        if (data?.totp_enabled && data?.totp_secret) {
          const isValid = verifyTOTP(data.totp_secret, token);
          if (!isValid) {
            return NextResponse.json({ error: 'Mã xác thực không đúng' }, { status: 400 });
          }
        }

        // Disable TOTP
        const { error: updateError } = await supabase
          .from('admin_settings')
          .update({
            totp_enabled: false,
            totp_secret: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', 'admin');

        if (updateError) {
          return NextResponse.json({ error: 'Không thể tắt TOTP' }, { status: 500 });
        }

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
