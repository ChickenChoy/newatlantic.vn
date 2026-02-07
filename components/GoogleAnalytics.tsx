'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { pageview, GA_MEASUREMENT_ID } from '@/lib/analytics';

// Extend Window interface for Do Not Track
declare global {
  interface Window {
    doNotTrack?: string;
  }
}

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isGALoaded, setIsGALoaded] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);

  // Check for cookie consent
  useEffect(() => {
    const checkConsent = () => {
      // Respect Do Not Track browser setting
      if (typeof navigator !== 'undefined' && navigator.doNotTrack === '1') {
        setHasConsent(false);
        return;
      }

      if (typeof window !== 'undefined' && window.doNotTrack === '1') {
        setHasConsent(false);
        return;
      }

      // Check for saved cookie consent
      try {
        const consent = localStorage.getItem('cookie-consent');
        if (consent) {
          const preferences = JSON.parse(consent);
          setHasConsent(preferences.analytics === true);
        }
      } catch (error) {
        console.error('Failed to read cookie consent:', error);
        setHasConsent(false);
      }
    };

    // Check consent on mount
    checkConsent();

    // Listen for consent changes
    const handleConsentUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const preferences = customEvent.detail;
      setHasConsent(preferences.analytics === true);
    };

    window.addEventListener('cookie-consent-updated', handleConsentUpdate);

    return () => {
      window.removeEventListener('cookie-consent-updated', handleConsentUpdate);
    };
  }, []);

  // Update consent mode when consent changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.gtag) return;

    if (hasConsent) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
    } else {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
      });
    }
  }, [hasConsent]);

  // Track page views only if consent is given
  useEffect(() => {
    if (pathname && isGALoaded && hasConsent) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      pageview(url);
    }
  }, [pathname, searchParams, isGALoaded, hasConsent]);

  // Don't render if no measurement ID
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    return null;
  }

  // ALWAYS load the gtag script (Google needs to detect it for verification)
  // Use Consent Mode v2 to control data collection based on user consent
  return (
    <>
      {/* Google Analytics 4 - Consent Mode v2 */}
      {/* Default consent: denied until user accepts */}
      <Script
        id="ga-consent-default"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              analytics_storage: 'denied',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              wait_for_update: 500
            });
          `,
        }}
      />

      {/* Load gtag.js */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        onLoad={() => setIsGALoaded(true)}
      />
      <Script
        id="ga-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              send_page_view: true,
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure'
            });
          `,
        }}
      />
    </>
  );
}
