'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import PasswordInput from '@/components/PasswordInput';
import AdminSidebar from '@/components/admin/AdminSidebar';
import './admin.css';

type AuthStep = 'password' | 'totp' | 'authenticated';

// Context cho logout function và totpEnabled
interface AdminContextType {
  handleLogout: () => void;
  totpEnabled: boolean;
}

export const AdminContext = createContext<AdminContextType>({
  handleLogout: () => { },
  totpEnabled: false,
});

export const useAdminContext = () => useContext(AdminContext);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authStep, setAuthStep] = useState<AuthStep>('password');
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
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
      <div className="min-h-screen flex items-center justify-center bg-lightgray">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra xác thực...</p>
        </div>
      </div>
    );
  }

  // Form nhập mật khẩu
  if (authStep === 'password') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primaryemphasis rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/25">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-bodytext mb-2">Admin Panel</h1>
              <p className="text-muted">Đăng nhập để quản lý nội dung</p>
            </div>

            <form onSubmit={handlePasswordLogin} className="space-y-5">
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu admin"
                label="Mật khẩu"
                required
                autoFocus
              />

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-primary to-primaryemphasis text-white rounded-xl hover:opacity-90 transition-all font-medium shadow-lg shadow-primary/25"
              >
                Đăng nhập
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <button
                onClick={() => router.push('/')}
                className="w-full text-bodytext hover:text-primary transition-colors text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay lại trang chủ
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
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-bodytext mb-2">Xác thực hai yếu tố</h1>
              <p className="text-muted text-sm">
                Nhập mã 6 số từ ứng dụng Google Authenticator
              </p>
            </div>

            <form onSubmit={handleTotpVerify} className="space-y-5">
              <div>
                <label htmlFor="totp" className="block text-sm font-medium text-bodytext mb-2">
                  Mã xác thực
                </label>
                <input
                  type="text"
                  id="totp"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-dark text-center text-2xl tracking-widest font-mono bg-lightgray"
                  placeholder="000000"
                  required
                  autoFocus
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={totpCode.length !== 6}
                className="w-full px-6 py-3 bg-gradient-to-r from-primary to-primaryemphasis text-white rounded-xl hover:opacity-90 transition-all font-medium shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Xác thực
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <button
                onClick={() => {
                  localStorage.removeItem('admin_auth_token');
                  localStorage.removeItem('admin_auth_expiry');
                  setAuthStep('password');
                }}
                className="w-full text-bodytext hover:text-primary transition-colors text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay lại đăng nhập
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Đã đăng nhập - hiển thị nội dung admin với sidebar layout kiểu MatDash
  return (
    <AdminContext.Provider value={{ handleLogout, totpEnabled }}>
      <div className="flex min-h-screen bg-lightgray dark:bg-dark font-sans">
        {/* Sidebar - imported component */}
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 min-h-screen xl:ml-64 transition-all duration-300">
          {/* Top Header */}
          <div className="h-[70px]" />

          {/* Page Content */}
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </AdminContext.Provider>
  );
}
