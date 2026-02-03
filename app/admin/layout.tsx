'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { AdminUser, UserRole, Permission, hasPermission as checkPermission } from '@/types';
import './admin.css';

type AuthStep = 'login' | 'totp' | 'authenticated';

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
  const router = useRouter();
  const supabase = getSupabaseClient();

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        if (!session) {
          setAuthStep('login');
          setUserEmail(null);
          setIsLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    try {
      // Check Supabase session
      const { data: { session } } = await supabase.auth.getSession();

      // Check TOTP status from API
      const totpRes = await fetch('/api/totp');
      const totpData = await totpRes.json();
      setTotpEnabled(totpData.totpEnabled || false);

      // Check if TOTP was verified this session
      const totpVerified = sessionStorage.getItem('totp_verified');

      if (session) {
        setUserEmail(session.user.email || null);

        // Fetch current user data for permissions
        await fetchCurrentUser(session.user.email || '');

        if (totpData.totpEnabled && totpVerified !== 'true') {
          // Need TOTP verification
          setAuthStep('totp');
        } else {
          setAuthStep('authenticated');
        }
      } else {
        // No session - reset to login state
        setAuthStep('login');
        setUserEmail(null);
        setCurrentUser(null);
        sessionStorage.removeItem('totp_verified');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      // On error, reset to login state for safety
      setAuthStep('login');
      setUserEmail(null);
      setCurrentUser(null);
    }
    setIsLoading(false);
    setIsLoadingUser(false);
  };

  // Fetch current user from API
  const fetchCurrentUser = async (email: string, updateLogin: boolean = true) => {
    if (!email) {
      setCurrentUser(null);
      setIsLoadingUser(false);
      return;
    }

    try {
      setIsLoadingUser(true);
      const loginParam = updateLogin ? '&updateLogin=true' : '';
      const response = await fetch(`/api/users?action=me&email=${encodeURIComponent(email)}${loginParam}`);

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user || null);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setCurrentUser(null);
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message === 'Invalid login credentials'
          ? 'Email hoặc mật khẩu không đúng!'
          : authError.message);
        setIsLoading(false);
        return;
      }

      if (data.session) {
        setUserEmail(data.session.user.email || null);
        setEmail('');
        setPassword('');

        // Check TOTP
        const totpRes = await fetch('/api/totp');
        const totpData = await totpRes.json();

        if (totpData.totpEnabled) {
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
        body: JSON.stringify({ action: 'verify', token: totpCode }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
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
      // Clear all session-related storage
      sessionStorage.removeItem('totp_verified');
      sessionStorage.clear();

      // Clear Supabase-related localStorage items
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // Clear all Supabase cookies (used by @supabase/ssr)
      document.cookie.split(';').forEach(cookie => {
        const name = cookie.split('=')[0].trim();
        if (name.startsWith('sb-') || name.includes('supabase')) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
        }
      });

      // Sign out with global scope to clear all sessions
      await supabase.auth.signOut({ scope: 'global' });

      // Reset state
      setAuthStep('login');
      setUserEmail(null);

      // Small delay to ensure everything is cleared
      await new Promise(resolve => setTimeout(resolve, 100));

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
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
                  placeholder="admin@newatlantic.vn"
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
            Bảo mật bởi Supabase
          </p>
        </div>
      </div>
    );
  }

  // TOTP verification form
  if (authStep === 'totp') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
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
                onClick={() => {
                  supabase.auth.signOut();
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
    }}>
      <div className="flex min-h-screen bg-lightgray dark:bg-dark font-sans">
        <AdminSidebar />
        <main className="flex-1 min-h-screen xl:ml-64 transition-all duration-300">
          <div className="h-[70px]" />
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </AdminContext.Provider>
  );
}
