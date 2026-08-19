'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ArrowButton from './sections/ArrowButton';

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

/** Neutral pill used for the two secondary choices next to the accent CTA. */
const SECONDARY_BUTTON =
  'rounded-pill border border-navy/14 px-5 py-[13px] text-sm font-semibold leading-none text-navy transition-colors duration-300 ease-brand hover:border-navy';

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative h-7 w-14 flex-shrink-0 rounded-pill transition-colors duration-300 ease-brand ${
        checked ? 'bg-accent' : 'bg-navy/14'
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-pill bg-white shadow-sm transition-transform duration-300 ease-brand ${
          checked ? 'translate-x-7' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

function PreferenceRow({
  title,
  subtitle,
  body,
  icon,
  control,
}: {
  title: string;
  subtitle: string;
  body: string;
  icon: React.ReactNode;
  control: React.ReactNode;
}) {
  return (
    <div className="rounded-card border border-navy/14 bg-surface p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-card border border-navy/14 bg-white text-navy/60">
            {icon}
          </div>
          <div>
            <h3 className="font-display text-[15px] uppercase leading-tight tracking-display text-navy">
              {title}
            </h3>
            <p className="mt-1 text-sm leading-[1.6] text-ink">{subtitle}</p>
          </div>
        </div>
        {control}
      </div>
      <p className="mt-3 text-sm leading-[1.6] text-muted">{body}</p>
    </div>
  );
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
      <div className="fixed inset-0 z-[9998] bg-navy/60 backdrop-blur-sm" />

      {/* Cookie Banner */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-consent-title"
        className="animate-slide-up fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
      >
        <div className="mx-auto max-w-6xl overflow-hidden rounded-card border border-navy/14 bg-white shadow-xl">
          {!showPreferences ? (
            // Main Banner
            <div className="p-6 md:p-8">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-card border border-navy/14 bg-surface text-navy">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h.01M12 15h.01M15 11h.01M12 3a9 9 0 109 9 3 3 0 01-3-3 3 3 0 01-3-3 3 3 0 01-3-3z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2
                    id="cookie-consent-title"
                    className="font-display text-d5 uppercase leading-display tracking-display text-navy"
                  >
                    Cookie &amp; Quyền riêng tư
                  </h2>
                  <p className="mt-3 max-w-3xl text-base leading-[1.6] text-ink">
                    Chúng tôi sử dụng cookies để cải thiện trải nghiệm của bạn, phân tích lưu lượng truy cập và cá nhân hóa nội dung.
                    Bạn có thể chọn loại cookies mà bạn chấp nhận.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <ArrowButton onClick={acceptAll} variant="accent">
                  Chấp nhận tất cả
                </ArrowButton>
                <button onClick={acceptNecessary} className={SECONDARY_BUTTON}>
                  Chỉ cần thiết
                </button>
                <button onClick={() => setShowPreferences(true)} className={SECONDARY_BUTTON}>
                  Tùy chỉnh
                </button>
              </div>

              <div className="mt-6 border-t border-navy/14 pt-4">
                <Link
                  href="/chinh-sach-bao-mat"
                  className="text-sm font-medium text-navy underline decoration-navy/30 underline-offset-4 transition-colors duration-300 ease-brand hover:text-accent hover:decoration-accent"
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
                  className="mb-4 flex items-center gap-2 text-sm font-medium text-navy/60 transition-colors duration-300 ease-brand hover:text-accent"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                  Quay lại
                </button>
                <h2
                  id="cookie-consent-title"
                  className="font-display text-d5 uppercase leading-display tracking-display text-navy"
                >
                  Tùy chỉnh Cookie
                </h2>
                <p className="mt-3 text-base leading-[1.6] text-ink">
                  Chọn loại cookies mà bạn muốn cho phép
                </p>
              </div>

              <div className="mb-6 space-y-3">
                {/* Necessary Cookies */}
                <PreferenceRow
                  title="Cookies cần thiết"
                  subtitle="Bắt buộc cho hoạt động của website"
                  body="Cookies này cần thiết để website hoạt động và không thể tắt. Chúng thường chỉ được đặt để đáp ứng các hành động của bạn như đăng nhập, điền biểu mẫu."
                  icon={
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 3l7 4v5c0 4.418-2.867 7.61-7 9-4.133-1.39-7-4.582-7-9V7l7-4z"
                      />
                    </svg>
                  }
                  control={
                    <span className="flex-shrink-0 rounded-pill border border-navy/14 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-navy/60">
                      Luôn bật
                    </span>
                  }
                />

                {/* Analytics Cookies */}
                <PreferenceRow
                  title="Cookies phân tích"
                  subtitle="Google Analytics để hiểu cách sử dụng"
                  body="Giúp chúng tôi hiểu cách khách truy cập tương tác với website, cải thiện trải nghiệm người dùng. Bao gồm Google Analytics 4."
                  icon={
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  }
                  control={
                    <ToggleSwitch
                      checked={preferences.analytics}
                      onChange={() => togglePreference('analytics')}
                      label="Bật cookies phân tích"
                    />
                  }
                />

                {/* Marketing Cookies */}
                <PreferenceRow
                  title="Cookies marketing"
                  subtitle="Quảng cáo và nội dung được cá nhân hóa"
                  body="Được sử dụng để hiển thị quảng cáo phù hợp với sở thích của bạn. Có thể bao gồm nội dung từ các đối tác bên thứ ba."
                  icon={
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                      />
                    </svg>
                  }
                  control={
                    <ToggleSwitch
                      checked={preferences.marketing}
                      onChange={() => togglePreference('marketing')}
                      label="Bật cookies marketing"
                    />
                  }
                />
              </div>

              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <ArrowButton onClick={saveCustomPreferences} variant="accent">
                  Lưu tùy chọn
                </ArrowButton>
                <button onClick={acceptAll} className={SECONDARY_BUTTON}>
                  Chấp nhận tất cả
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
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
