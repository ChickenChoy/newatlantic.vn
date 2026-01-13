'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Mật khẩu admin - ĐỔI MẬT KHẨU NÀY ĐỂ BẢO MẬT
  const ADMIN_PASSWORD = '@Tandaitayduong';

  useEffect(() => {
    // Kiểm tra xem đã đăng nhập chưa
    const authToken = localStorage.getItem('admin_auth_token');
    const authExpiry = localStorage.getItem('admin_auth_expiry');
    
    if (authToken && authExpiry) {
      const now = new Date().getTime();
      if (authToken === 'authenticated' && parseInt(authExpiry) > now) {
        setIsAuthenticated(true);
      } else {
        // Token hết hạn, xóa đi
        localStorage.removeItem('admin_auth_token');
        localStorage.removeItem('admin_auth_expiry');
      }
    }
    
    setIsLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Kiểm tra mật khẩu
    if (password === ADMIN_PASSWORD) {
      // Lưu token và thời gian hết hạn (24 giờ)
      const expiry = new Date().getTime() + (24 * 60 * 60 * 1000);
      localStorage.setItem('admin_auth_token', 'authenticated');
      localStorage.setItem('admin_auth_expiry', expiry.toString());
      setIsAuthenticated(true);
      setPassword('');
    } else {
      setError('Mật khẩu không đúng!');
      setPassword('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth_token');
    localStorage.removeItem('admin_auth_expiry');
    setIsAuthenticated(false);
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

  // Chưa đăng nhập - hiển thị form login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-16">
        <div className="max-w-md w-full">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#5f7ab8] mb-2">Admin Panel</h1>
              <p className="text-gray-600">Đăng nhập để quản lý nội dung</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:border-[#5f7ab8] text-gray-900"
                  placeholder="Nhập mật khẩu admin"
                  required
                  autoFocus
                />
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

  // Đã đăng nhập - hiển thị nội dung admin với header logout
  return (
    <>
      {/* Admin Header Bar - nằm dưới Header chính */}
      <div
        className="bg-white border-b border-gray-200 fixed left-0 right-0"
        style={{ top: '72px', zIndex: 100 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1.5 text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Admin đã xác thực
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
      <div className="pt-[86px]">
        {children}
      </div>
    </>
  );
}
