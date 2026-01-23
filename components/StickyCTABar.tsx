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
 * Sticky CTA bar for mobile devices that appears on scroll
 * Automatically hides when near footer and on desktop (lg+)
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
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden animate-slide-up"
    >
      {/* Gradient shadow above bar */}
      <div className="h-4 bg-gradient-to-t from-[#050c3a] to-transparent"></div>

      {/* Main CTA Bar */}
      <div className="bg-gradient-to-r from-[#0a1854] via-[#0d1f6b] to-[#0a1854] border-t border-white/10 backdrop-blur-lg px-3 py-2.5 safe-area-pb">
        <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
          {/* Product mini info */}
          {productName && (
            <div className="hidden xs:block flex-1 min-w-0 pr-2">
              <p className="text-[10px] text-gray-400 truncate">Đang xem:</p>
              <p className="text-xs text-white font-medium truncate" title={productName}>{productName}</p>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Zalo Button */}
            <Link
              href={zaloLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[#0068ff] hover:bg-[#0055d4] text-white px-3 py-2 rounded-lg transition-all duration-300 active:scale-95 shadow-lg shadow-blue-500/20"
              aria-label="Chat qua Zalo"
            >
              {/* Zalo-style chat icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L2 22l5.71-.97c1.31.61 2.75.97 4.29.97 5.52 0 10-4.48 10-10S17.52 2 12 2zm4.88 13.76c-.24.67-1.38 1.24-1.91 1.32-.53.08-1.07.12-3.45-.74-2.86-1.03-4.66-3.93-4.8-4.11-.14-.18-1.1-1.46-1.1-2.79s.69-1.98.94-2.25c.25-.27.54-.33.72-.33.18 0 .36.01.51.01.18.01.4.01.61.48.24.54.8 1.98.87 2.12.07.15.12.32.02.51-.09.19-.14.3-.28.46-.14.16-.29.35-.42.47-.14.14-.28.28-.12.55.16.27.72 1.18 1.55 1.91 1.06.94 1.96 1.23 2.24 1.37.28.14.44.12.61-.07.16-.19.69-.8.87-1.08.18-.28.36-.23.61-.14.25.09 1.57.74 1.84.88.27.14.45.21.51.32.08.12.08.67-.15 1.33z"/>
              </svg>
              <span className="text-xs font-semibold">Zalo</span>
            </Link>

            {/* Call Button - Primary */}
            <Link
              href={`tel:${phoneNumber}`}
              className="group flex items-center gap-1.5 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] hover:from-[#4a6199] hover:to-[#3d4f7a] text-white px-4 py-2 rounded-lg transition-all duration-300 active:scale-95 shadow-lg shadow-indigo-500/20 relative overflow-hidden"
              aria-label="Gọi điện thoại tư vấn"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

              <svg className="w-4 h-4 relative z-10 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-xs font-bold relative z-10">Gọi ngay</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
