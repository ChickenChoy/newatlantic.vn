'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type AuthStep = 'password' | 'totp' | 'authenticated';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authStep, setAuthStep] = useState<AuthStep>('password');
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [totpCode, setTotpCode] = useState('');
  const [error, setError] = useState('');
  const [totpEnabled, setTotpEnabled] = useState(false);
  const router = useRouter();

  // Mật khẩu admin - ĐỔI MẬT KHẨU NÀY ĐỂ BẢO MẬT
  const ADMIN_PASSWORD = '@Tandaitayduong';

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // Kiểm tra xem đã đăng nhập chưa
    const authToken = localStorage.getItem('admin_auth_token');
    const authExpiry = localStorage.getItem('admin_auth_expiry');
    const totpVerified = localStorage.getItem('admin_totp_verified');

    // Check TOTP status from server
    try {
      const response = await fetch('/api/totp');
      if (response.ok) {
        const data = await response.json();
        setTotpEnabled(data.totpEnabled);
      }
    } catch (error) {
      console.error('Error checking TOTP status:', error);
    }

    if (authToken && authExpiry) {
      const now = new Date().getTime();
      if (authToken === 'authenticated' && parseInt(authExpiry) > now) {
        // Check if TOTP was verified for this session
        if (totpEnabled && totpVerified !== 'true') {
          setAuthStep('totp');
        } else {
          setAuthStep('authenticated');
        }
      } else {
        // Token hết hạn, xóa đi
        localStorage.removeItem('admin_auth_token');
        localStorage.removeItem('admin_auth_expiry');
        localStorage.removeItem('admin_totp_verified');
      }
    }

    setIsLoading(false);
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Kiểm tra mật khẩu
    if (password === ADMIN_PASSWORD) {
      // Lưu token và thời gian hết hạn (24 giờ)
      const expiry = new Date().getTime() + (24 * 60 * 60 * 1000);
      localStorage.setItem('admin_auth_token', 'authenticated');
      localStorage.setItem('admin_auth_expiry', expiry.toString());
      setPassword('');

      // Check if TOTP is enabled
      if (totpEnabled) {
        setAuthStep('totp');
      } else {
        setAuthStep('authenticated');
      }
    } else {
      setError('Mật khẩu không đúng!');
      setPassword('');
    }
  };

  const handleTotpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/totp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', token: totpCode }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('admin_totp_verified', 'true');
        setAuthStep('authenticated');
        setTotpCode('');
      } else {
        setError(data.error || 'Mã xác thực không đúng!');
        setTotpCode('');
      }
    } catch (error) {
      console.error('Error verifying TOTP:', error);
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
      setTotpCode('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth_token');
    localStorage.removeItem('admin_auth_expiry');
    localStorage.removeItem('admin_totp_verified');
    setAuthStep('password');
    router.push('/');
  };

  // Đang kiểm tra auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5f7ab8] mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra xác thực...</p>
        </div>
      </div>
    );
  }

  // Form nhập mật khẩu
  if (authStep === 'password') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-16">
        <div className="max-w-md w-full">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#5f7ab8] mb-2">Admin Panel</h1>
              <p className="text-gray-600">Đăng nhập để quản lý nội dung</p>
            </div>

            <form onSubmit={handlePasswordLogin} className="space-y-5">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded focus:outline-none focus:border-[#5f7ab8] text-gray-900"
                    placeholder="Nhập mật khẩu admin"
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-2.5 rounded text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full px-6 py-2.5 bg-[#5f7ab8] text-white rounded hover:bg-[#4a6199] transition-colors font-medium"
              >
                Đăng nhập
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => router.push('/')}
                className="w-full text-gray-600 hover:text-[#5f7ab8] transition-colors text-sm"
              >
                ← Quay lại trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form nhập mã TOTP
  if (authStep === 'totp') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-16">
        <div className="max-w-md w-full">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#5f7ab8]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#5f7ab8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Xác thực hai yếu tố</h1>
              <p className="text-gray-600 text-sm">
                Nhập mã 6 số từ ứng dụng Google Authenticator
              </p>
            </div>

            <form onSubmit={handleTotpVerify} className="space-y-5">
              <div>
                <label htmlFor="totp" className="block text-sm font-medium text-gray-700 mb-2">
                  Mã xác thực
                </label>
                <input
                  type="text"
                  id="totp"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#5f7ab8] text-gray-900 text-center text-2xl tracking-widest font-mono"
                  placeholder="000000"
                  required
                  autoFocus
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-2.5 rounded text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={totpCode.length !== 6}
                className="w-full px-6 py-2.5 bg-[#5f7ab8] text-white rounded hover:bg-[#4a6199] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Xác thực
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  localStorage.removeItem('admin_auth_token');
                  localStorage.removeItem('admin_auth_expiry');
                  setAuthStep('password');
                }}
                className="w-full text-gray-600 hover:text-[#5f7ab8] transition-colors text-sm"
              >
                ← Quay lại đăng nhập
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Đã đăng nhập - hiển thị nội dung admin với header logout
  return (
    <>
      {/* Admin Header Bar - nằm dưới Header chính */}
      <div
        className="bg-white border-b border-gray-200 fixed left-0 right-0 top-[100px] md:top-[72px]"
        style={{ zIndex: 100 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12 md:h-14">
            <div className="flex items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1.5 text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Admin đã xác thực
                {totpEnabled && (
                  <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                    2FA
                  </span>
                )}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors font-medium"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* Content với padding top để không bị che */}
      <div className="pt-[148px] md:pt-[128px]">
        {children}
      </div>
    </>
  );
}
