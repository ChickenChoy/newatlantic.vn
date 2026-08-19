'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { AdminUser, UserRole, Permission, hasPermission as checkPermission } from '@/types';
import './admin.css';

type AuthStep = 'login' | 'totp' | 'authenticated';

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

// Extended AdminContext with user management
interface AdminContextType {
  handleLogout: () => void;
  userEmail: string | null;
  mfaEnabled: boolean;
  // New fields for multi-user management
  currentUser: AdminUser | null;
  userRole: UserRole | undefined;
  hasPermission: (permission: Permission) => boolean;
  canAccessTab: (tabId: string) => boolean;
  isLoadingUser: boolean;
  refreshUser: () => Promise<void>;
  // Sidebar state
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
}

export const AdminContext = createContext<AdminContextType>({
  handleLogout: () => { },
  userEmail: null,
  mfaEnabled: false,
  currentUser: null,
  userRole: undefined,
  hasPermission: () => false,
  canAccessTab: () => false,
  isLoadingUser: true,
  refreshUser: async () => { },
  isSidebarCollapsed: false,
  setIsSidebarCollapsed: () => { },
});

export const useAdminContext = () => useContext(AdminContext);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authStep, setAuthStep] = useState<AuthStep>('login');
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // New state for user management
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  // Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // A reload must only drop to the login screen when the server actually says
    // "not authenticated". A 5xx or a dropped connection is INDETERMINATE — if we
    // treated it as a logout, a transient blip would look exactly like the session
    // expiring, which is the "F5 makes me get kicked out" symptom.
    const MAX_ATTEMPTS = 3;
    let lastFailure: string | null = null;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const res = await fetch(`/api/auth/me?_t=${Date.now()}`, {
          credentials: 'same-origin',
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
        });

        // Definitive "you are not logged in".
        if (res.status === 401 || res.status === 403) {
          applySignedOut();
          return;
        }

        // Indeterminate — server-side fault. Retry rather than logging out.
        if (!res.ok) {
          lastFailure = `HTTP ${res.status}`;
          if (attempt < MAX_ATTEMPTS) {
            await sleep(attempt * 400);
            continue;
          }
          break;
        }

        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          // Something intercepted the request (offline page, proxy error page).
          // Also indeterminate, not a logout.
          lastFailure = 'phản hồi không hợp lệ';
          if (attempt < MAX_ATTEMPTS) {
            await sleep(attempt * 400);
            continue;
          }
          break;
        }

        const { user, totpVerified } = await res.json();

        if (!user) {
          applySignedOut();
          return;
        }

        setUserEmail(user.email || null);
        setCurrentUser(user);
        setTotpEnabled(user.totpEnabled || false);

        if (user.totpEnabled && !totpVerified) {
          setAuthStep('totp');
        } else {
          setAuthStep('authenticated');
        }

        setIsLoading(false);

        // Refresh the full profile in the background. `user` is passed as a
        // fallback so a failure here can never null out currentUser — that would
        // make every hasPermission()/canAccessTab() check return false and the
        // panel would render with no usable tabs.
        fetchCurrentUser(user.email, true, user).catch(console.error);
        return;
      } catch (error) {
        console.error(`Error checking auth (attempt ${attempt}/${MAX_ATTEMPTS}):`, error);
        lastFailure = 'không kết nối được máy chủ';
        if (attempt < MAX_ATTEMPTS) {
          await sleep(attempt * 400);
        }
      }
    }

    // Every attempt was indeterminate. Show the login form (we genuinely cannot
    // confirm a session) but say WHY, so a server outage is not mistaken for a
    // silent logout.
    applySignedOut();
    setError(
      `Không xác minh được phiên đăng nhập (${lastFailure ?? 'lỗi không rõ'}). Vui lòng thử lại.`
    );
  };

  const applySignedOut = () => {
    setAuthStep('login');
    setUserEmail(null);
    setCurrentUser(null);
    setIsLoading(false);
    setIsLoadingUser(false);
    try {
      sessionStorage.removeItem('totp_verified');
    } catch {
      // sessionStorage can throw in hardened/private browsing modes.
    }
  };

  // Fetch current user from API
  const fetchCurrentUser = async (
    email: string,
    updateLogin: boolean = true,
    fallbackUser: AdminUser | null = null
  ) => {
    if (!email) {
      setCurrentUser(prev => prev ?? fallbackUser);
      setIsLoadingUser(false);
      return;
    }

    try {
      setIsLoadingUser(true);
      const loginParam = updateLogin ? '&updateLogin=true' : '';
      const response = await fetch(
        `/api/users?action=me&email=${encodeURIComponent(email)}${loginParam}&_t=${Date.now()}`,
        { credentials: 'same-origin', cache: 'no-store' }
      );

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user || fallbackUser);
      } else {
        // Keep whoever we already have; dropping to null strips all permissions.
        console.error('Error fetching user profile: HTTP', response.status);
        setCurrentUser(prev => prev ?? fallbackUser);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setCurrentUser(prev => prev ?? fallbackUser);
    } finally {
      setIsLoadingUser(false);
    }
  };

  // Refresh user data (without updating login time)
  const refreshUser = useCallback(async () => {
    if (userEmail) {
      await fetchCurrentUser(userEmail, false);
    }
  }, [userEmail]);

  // Check if user has a specific permission
  const hasPermissionCheck = useCallback((permission: Permission): boolean => {
    if (!currentUser || !currentUser.isActive) return false;
    return checkPermission(currentUser.role, permission);
  }, [currentUser]);

  // Tab permission mapping
  const tabPermissions: Record<string, Permission> = {
    'products': 'manage_content',
    'categories': 'manage_content',
    'posts': 'manage_content',
    'post-categories': 'manage_content',
    'gallery': 'manage_content',
    'catalogs': 'manage_content',
    'partners': 'manage_content',
    'testimonials': 'manage_content',
    'faqs': 'manage_content',
    'certifications': 'manage_content',
    'media-library': 'manage_media',
    'video-library': 'manage_media',
    'homepage-services': 'manage_appearance',
    'hero-slides': 'manage_appearance',
    'holiday-effects': 'manage_appearance',
    'page-visibility': 'manage_appearance',
    'navbar-settings': 'manage_appearance',
    'appearance': 'manage_appearance',
    'site-settings': 'manage_settings',
    'offices': 'manage_settings',
    'footer': 'manage_settings',
    'footer-links': 'manage_settings',
    'social-links': 'manage_settings',
    'seo': 'manage_seo',
    'dashboard': 'view_dashboard',
    'traffic': 'view_analytics',
    'database': 'backup_restore',
    'activity-logs': 'view_activity_logs',
    'settings': 'manage_security',
    'users': 'manage_users',
  };

  // Check if user can access a tab
  const canAccessTabCheck = useCallback((tabId: string): boolean => {
    if (!currentUser || !currentUser.isActive) return false;
    const requiredPermission = tabPermissions[tabId];
    if (!requiredPermission) return true; // No specific permission required
    return checkPermission(currentUser.role, requiredPermission);
  }, [currentUser]);

  /**
   * Re-probe the session endpoint on a fresh request to prove the browser really
   * stored (and will resend) the session cookie. This is what turns a silent
   * "logged in until you reload" failure into an actionable error at login time.
   */
  const confirmSessionPersisted = async (): Promise<boolean> => {
    try {
      const res = await fetch(`/api/auth/me?_t=${Date.now()}`, {
        credentials: 'same-origin',
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
      });
      if (!res.ok) return false;
      const data = await res.json();
      return Boolean(data?.user);
    } catch (error) {
      console.error('Session persistence check failed:', error);
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Email hoặc mật khẩu không đúng!');
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // The 200 above only proves the credentials were right — it does NOT prove
        // the browser kept the session cookie. If the cookie was rejected (e.g. a
        // `Secure` cookie over plain HTTP), entering the panel here would "work"
        // and then break on the very next request: reload kicks you back to login
        // and every save returns 401. So confirm the session round-trips first.
        const sessionOk = await confirmSessionPersisted();

        if (!sessionOk) {
          setError(
            'Đăng nhập đúng nhưng trình duyệt không lưu được phiên (cookie bị chặn). ' +
            'Vui lòng bật cookie cho trang này, hoặc truy cập admin qua HTTPS.'
          );
          setIsLoading(false);
          return;
        }

        setUserEmail(data.user.email || null);
        setCurrentUser(data.user);
        setEmail('');
        setPassword('');

        if (data.user.totpEnabled && !data.totpVerified) {
          setTotpEnabled(true);
          setAuthStep('totp');
        } else {
          sessionStorage.setItem('totp_verified', 'true');
          setAuthStep('authenticated');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    }
    setIsLoading(false);
  };

  const handleTotpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/totp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', token: totpCode, userEmail }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Mark server-side session as TOTP-verified so F5 stays logged in
        await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'verify-totp' }),
        });

        sessionStorage.setItem('totp_verified', 'true');
        setAuthStep('authenticated');
        setTotpCode('');
      } else {
        setError(data.error || 'Mã xác thực không đúng!');
        setTotpCode('');
      }
    } catch (error) {
      console.error('TOTP verify error:', error);
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    try {
      // Tell server to destroy session and clear cookie
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });

      // Clear local verification state
      sessionStorage.removeItem('totp_verified');
      sessionStorage.clear();

      // Reset state
      setAuthStep('login');
      setUserEmail(null);
      setCurrentUser(null);

      // Force reload to ensure clean state
      window.location.href = '/admin';
    } catch (error) {
      console.error('Logout error:', error);
      // Force reload anyway
      window.location.href = '/admin';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="admin-system-font min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra xác thực...</p>
        </div>
      </div>
    );
  }

  // Login form
  if (authStep === 'login') {
    return (
      <div className="admin-system-font min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="max-w-md w-full">
          <div className="mb-10">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              ADMIN PANEL
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Đăng nhập<span className="text-blue-600">.</span>
            </h1>
            <p className="text-gray-500 mt-2">
              Quản lý nội dung website của bạn
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="border border-gray-200 rounded-full bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <div className="flex items-center">
                <label htmlFor="email" className="pl-5 pr-3 py-4 text-sm font-medium text-gray-500 whitespace-nowrap">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 py-4 pr-5 bg-transparent focus:outline-none text-gray-900 placeholder-gray-300"
                  placeholder="*@newatlantic.vn"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="border border-gray-200 rounded-full bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <div className="flex items-center">
                <label htmlFor="password" className="pl-5 pr-3 py-4 text-sm font-medium text-gray-500 whitespace-nowrap">
                  Mật khẩu
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 py-4 bg-transparent focus:outline-none text-gray-900 placeholder-gray-300"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-5 text-gray-400 hover:text-gray-600 transition-colors"
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
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium"
              >
                ← Trang chủ
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all font-medium disabled:opacity-50"
              >
                {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
              </button>
            </div>
          </form>

          <p className="text-center text-gray-400 text-xs mt-12">
            &copy; NEW ATLANTIC Admin Panel
          </p>
        </div>
      </div>
    );
  }

  // TOTP verification form
  if (authStep === 'totp') {
    return (
      <div className="admin-system-font min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="max-w-md w-full">
          <div className="mb-10">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              XÁC THỰC 2 BƯỚC
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Nhập mã OTP<span className="text-blue-600">.</span>
            </h1>
            <p className="text-gray-500 mt-2">
              Mở Google Authenticator để lấy mã 6 số
            </p>
          </div>

          <form onSubmit={handleTotpVerify} className="space-y-6">
            <div className="border border-gray-200 rounded-full bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <div className="flex items-center">
                <label htmlFor="totp" className="pl-5 pr-3 py-4 text-sm font-medium text-gray-500 whitespace-nowrap">
                  Mã OTP
                </label>
                <input
                  type="text"
                  id="totp"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="flex-1 py-4 pr-5 bg-transparent focus:outline-none text-gray-900 text-center text-xl tracking-widest font-mono"
                  placeholder="000000"
                  required
                  autoFocus
                  maxLength={6}
                  inputMode="numeric"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={async () => {
                  await fetch('/api/auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'logout' }),
                  });
                  sessionStorage.removeItem('totp_verified');
                  setAuthStep('login');
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium"
              >
                ← Đăng nhập lại
              </button>
              <button
                type="submit"
                disabled={isLoading || totpCode.length !== 6}
                className="px-8 py-3.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all font-medium disabled:opacity-50"
              >
                {isLoading ? 'Đang xác thực...' : 'Xác thực'}
              </button>
            </div>
          </form>

          <p className="text-center text-gray-400 text-xs mt-12">
            Bảo mật bởi Google Authenticator
          </p>
        </div>
      </div>
    );
  }

  // Authenticated - show admin content
  return (
    <AdminContext.Provider value={{
      handleLogout,
      userEmail,
      mfaEnabled: totpEnabled,
      currentUser,
      userRole: currentUser?.role,
      hasPermission: hasPermissionCheck,
      canAccessTab: canAccessTabCheck,
      isLoadingUser,
      refreshUser,
      isSidebarCollapsed,
      setIsSidebarCollapsed,
    }}>
      <div className="admin-system-font flex min-h-screen bg-gray-100 dark:bg-gray-900 font-sans">
        <AdminSidebar />
        <main className={`flex-1 min-h-screen transition-all duration-300 ${isSidebarCollapsed ? 'xl:ml-20' : 'xl:ml-72'}`}>
          <div className="p-4 md:p-6 lg:p-8 xl:p-10">
            {children}
          </div>
        </main>
      </div>
    </AdminContext.Provider>
  );
}
