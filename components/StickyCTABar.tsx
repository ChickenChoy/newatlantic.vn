'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Configuration constants
const SCROLL_TRIGGER_THRESHOLD = 400; // Show CTA after scrolling past hero section
const FOOTER_PROXIMITY_OFFSET = 100; // Hide CTA when within 100px of footer

interface StickyCTABarProps {
  phoneNumber?: string;
  zaloLink?: string;
  productName?: string;
}

/**
 * Sticky CTA bar for mobile devices that appears on scroll.
 * Automatically hides when near footer and on desktop (lg+).
 *
 * Styled on the brand's navy bar / accent action pairing: the call button owns
 * the accent so there is exactly one primary action, and Zalo sits beside it as
 * a quiet outline. Both are pills, matching the buttons used site-wide.
 */
export default function StickyCTABar({
  phoneNumber = '+842838733686',
  zaloLink = 'https://zalo.me/0283733686',
  productName
}: StickyCTABarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isNearFooter, setIsNearFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero/product info section
      const shouldShow = window.scrollY > SCROLL_TRIGGER_THRESHOLD;
      setIsVisible(shouldShow);

      // Check if near footer to hide
      const footer = document.querySelector('footer');
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const isNear = footerRect.top < window.innerHeight + FOOTER_PROXIMITY_OFFSET;
        setIsNearFooter(isNear);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Only show on mobile/tablet (hidden on lg and above via CSS)
  if (!isVisible || isNearFooter) return null;

  return (
    <div
      data-sticky-cta="true"
      className="animate-slide-up fixed bottom-0 left-0 right-0 z-50 lg:hidden"
    >
      {/* Soft scrim so page content fades out under the bar instead of butting against it */}
      <div aria-hidden="true" className="h-6 bg-gradient-to-t from-navy/40 to-transparent" />

      {/* Main CTA bar */}
      <div className="safe-area-pb border-t border-white/14 bg-navy/95 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          {/* Product mini info */}
          {productName && (
            <div className="hidden min-w-0 flex-1 xs:block">
              <p className="text-[10px] uppercase tracking-[0.14em] text-white/50">Đang xem</p>
              <p className="truncate text-xs font-medium text-white" title={productName}>
                {productName}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Zalo — secondary */}
            <Link
              href={zaloLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-pill border border-white/25 px-3.5 py-2.5 text-xs font-semibold text-white transition-colors duration-300 ease-brand hover:border-white hover:bg-white/10 active:scale-95"
              aria-label="Chat qua Zalo"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L2 22l5.71-.97c1.31.61 2.75.97 4.29.97 5.52 0 10-4.48 10-10S17.52 2 12 2zm4.88 13.76c-.24.67-1.38 1.24-1.91 1.32-.53.08-1.07.12-3.45-.74-2.86-1.03-4.66-3.93-4.8-4.11-.14-.18-1.1-1.46-1.1-2.79s.69-1.98.94-2.25c.25-.27.54-.33.72-.33.18 0 .36.01.51.01.18.01.4.01.61.48.24.54.8 1.98.87 2.12.07.15.12.32.02.51-.09.19-.14.3-.28.46-.14.16-.29.35-.42.47-.14.14-.28.28-.12.55.16.27.72 1.18 1.55 1.91 1.06.94 1.96 1.23 2.24 1.37.28.14.44.12.61-.07.16-.19.69-.8.87-1.08.18-.28.36-.23.61-.14.25.09 1.57.74 1.84.88.27.14.45.21.51.32.08.12.08.67-.15 1.33z" />
              </svg>
              Zalo
            </Link>

            {/* Call — the single primary action, so it owns the accent */}
            <Link
              href={`tel:${phoneNumber}`}
              className="inline-flex items-center gap-1.5 rounded-pill bg-accent px-5 py-2.5 text-xs font-bold text-white transition-colors duration-300 ease-brand hover:bg-accent-dark active:scale-95"
              aria-label="Gọi điện thoại tư vấn"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Gọi ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
