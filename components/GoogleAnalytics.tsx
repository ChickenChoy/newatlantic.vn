'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { pageview, GA_MEASUREMENT_ID, GTM_ID } from '@/lib/analytics';

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

  // Track page views only if consent is given
  useEffect(() => {
    if (pathname && isGALoaded && hasConsent) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      pageview(url);
    }
  }, [pathname, searchParams, isGALoaded, hasConsent]);

  // Don't load analytics if no consent
  if (!hasConsent) {
    return null;
  }

  return (
    <>
      {/* Google Tag Manager */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `,
        }}
      />

      {/* Google Analytics 4 */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        onLoad={() => setIsGALoaded(true)}
      />
      <Script
        id="ga-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              send_page_view: false,
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure'
            });
          `,
        }}
      />

      {/* GTM noscript fallback */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
}

