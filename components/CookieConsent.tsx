'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

// Extend Window interface to include doNotTrack
declare global {
  interface Window {
    doNotTrack?: string;
  }
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    const dnt = navigator.doNotTrack === '1' || window.doNotTrack === '1';

    if (dnt) {
      // Respect Do Not Track setting
      const dntPreferences = {
        necessary: true,
        analytics: false,
        marketing: false,
      };
      localStorage.setItem('cookie-consent', JSON.stringify(dntPreferences));
      window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: dntPreferences }));
      return;
    }

    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      // Load saved preferences
      try {
        const savedPreferences = JSON.parse(consent);
        setPreferences(savedPreferences);
        window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: savedPreferences }));
      } catch (error) {
        console.error('Failed to parse cookie consent:', error);
        setShowBanner(true);
      }
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allAccepted);
  };

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    savePreferences(necessaryOnly);
  };

  const saveCustomPreferences = () => {
    savePreferences(preferences);
    setShowPreferences(false);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(prefs));
    setPreferences(prefs);
    setShowBanner(false);
    setShowPreferences(false);

    // Dispatch event for GoogleAnalytics component
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: prefs }));
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Necessary cookies cannot be disabled
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Open preferences from external trigger (e.g., footer link)
  useEffect(() => {
    const handleOpenPreferences = () => {
      setShowPreferences(true);
      setShowBanner(true);
    };

    window.addEventListener('open-cookie-preferences', handleOpenPreferences);
    return () => window.removeEventListener('open-cookie-preferences', handleOpenPreferences);
  }, []);

  if (!showBanner) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-[9998] backdrop-blur-sm" />

      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 animate-slide-up">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {!showPreferences ? (
            // Main Banner
            <div className="p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                    Cookie & Quyền Riêng Tư
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    Chúng tôi sử dụng cookies để cải thiện trải nghiệm của bạn, phân tích lưu lượng truy cập và cá nhân hóa nội dung.
                    Bạn có thể chọn loại cookies mà bạn chấp nhận.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <button
                  onClick={acceptAll}
                  className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-sm"
                >
                  Chấp nhận tất cả
                </button>
                <button
                  onClick={acceptNecessary}
                  className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors duration-200"
                >
                  Chỉ cần thiết
                </button>
                <button
                  onClick={() => setShowPreferences(true)}
                  className="flex-1 sm:flex-none px-6 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg transition-colors duration-200"
                >
                  Tùy chỉnh
                </button>
              </div>

              <div className="mt-4 text-center">
                <Link
                  href="/chinh-sach-bao-mat"
                  className="text-sm text-blue-600 hover:text-blue-700 underline"
                >
                  Đọc Chính sách Bảo mật
                </Link>
              </div>
            </div>
          ) : (
            // Preferences Panel
            <div className="p-6 md:p-8">
              <div className="mb-6">
                <button
                  onClick={() => setShowPreferences(false)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Quay lại
                </button>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  Tùy chỉnh Cookie
                </h2>
                <p className="text-gray-600">
                  Chọn loại cookies mà bạn muốn cho phép
                </p>
              </div>

              <div className="space-y-4 mb-6">
                {/* Necessary Cookies */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Cookies Cần thiết</h3>
                        <p className="text-sm text-gray-600">Bắt buộc cho hoạt động của website</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                      Luôn bật
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 ml-13">
                    Cookies này cần thiết để website hoạt động và không thể tắt. Chúng thường chỉ được đặt để đáp ứng các hành động của bạn như đăng nhập, điền biểu mẫu.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Cookies Phân tích</h3>
                        <p className="text-sm text-gray-600">Google Analytics để hiểu cách sử dụng</p>
                      </div>
                    </div>
                    <button
                      onClick={() => togglePreference('analytics')}
                      className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${preferences.analytics ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${preferences.analytics ? 'translate-x-7' : 'translate-x-0'
                          }`}
                      />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 ml-13">
                    Giúp chúng tôi hiểu cách khách truy cập tương tác với website, cải thiện trải nghiệm người dùng. Bao gồm Google Analytics 4.
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Cookies Marketing</h3>
                        <p className="text-sm text-gray-600">Quảng cáo và nội dung được cá nhân hóa</p>
                      </div>
                    </div>
                    <button
                      onClick={() => togglePreference('marketing')}
                      className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${preferences.marketing ? 'bg-purple-600' : 'bg-gray-300'
                        }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${preferences.marketing ? 'translate-x-7' : 'translate-x-0'
                          }`}
                      />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 ml-13">
                    Được sử dụng để hiển thị quảng cáo phù hợp với sở thích của bạn. Có thể bao gồm nội dung từ các đối tác bên thứ ba.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={saveCustomPreferences}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                >
                  Lưu tùy chọn
                </button>
                <button
                  onClick={acceptAll}
                  className="flex-1 px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-colors duration-200"
                >
                  Chấp nhận tất cả
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

// Helper function to check if analytics consent is given
export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false;

  // Check Do Not Track
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') {
    return false;
  }

  try {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) return false;

    const preferences = JSON.parse(consent);
    return preferences.analytics === true;
  } catch {
    return false;
  }
}

// Helper function to open cookie preferences
export function openCookiePreferences(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('open-cookie-preferences'));
  }
}
