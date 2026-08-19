'use client';

import { useState, useEffect, useRef, useMemo } from 'react';

interface LiveVisitorCountProps {
  productId: string;
  className?: string;
  showAvatars?: boolean;
  compact?: boolean;
  /** Light-on-dark variant, for use over navy and photographic backgrounds. */
  onDark?: boolean;
}

/** Avatar tints, drawn from the brand palette only — no off-brand hues. */
const AVATAR_TINTS = [
  'from-navy to-navy-light',
  'from-navy-light to-navy',
  'from-accent to-accent-light',
  'from-navy-dark to-navy-light',
];

// Avatar initials for the viewer stack
const AVATAR_INITIALS = ['ND', 'TH', 'VH', 'MT', 'HL', 'PT', 'AN', 'BT', 'CL', 'DK', 'EL', 'FM'];

/** Verb phrase shared by the pill label, the tooltip and the a11y label. */
const VIEWING = 'đang xem';

type HotLevel = 'normal' | 'warm' | 'hot';

/**
 * Live viewer counter, used as social proof on the product page.
 *
 * The pill follows the template's Eyebrow shape — hairline brand border, surface
 * fill, fully rounded — so it reads as a sibling of the category label it sits
 * beside. Heat is signalled with the accent colour rather than a separate hue
 * ramp, and the count keeps navy ink so it stays legible on the light page.
 */
export default function LiveVisitorCount({
  productId,
  className = '',
  showAvatars = true,
  compact = false,
  onDark = false,
}: LiveVisitorCountProps) {
  const [viewerCount, setViewerCount] = useState(0);
  const [prevCount, setPrevCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const initialCountRef = useRef<number | null>(null);

  // Memoize seed-based count calculation
  const baseCount = useMemo(() => {
    const seed = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (seed % 7) + 3; // 3-9 base viewers for more realistic feel
  }, [productId]);

  // Generate consistent avatars based on productId
  const avatars = useMemo(() => {
    const seed = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const count = Math.min(viewerCount, 4); // Max 4 avatars shown
    return Array.from({ length: count }, (_, i) => ({
      tint: AVATAR_TINTS[(seed + i) % AVATAR_TINTS.length],
      initial: AVATAR_INITIALS[(seed + i) % AVATAR_INITIALS.length],
    }));
  }, [productId, viewerCount]);

  // Determine hotness level
  const hotLevel: HotLevel = useMemo(() => {
    if (viewerCount >= 8) return 'hot';
    if (viewerCount >= 5) return 'warm';
    return 'normal';
  }, [viewerCount]);

  useEffect(() => {
    // Store initial count
    if (initialCountRef.current === null) {
      initialCountRef.current = baseCount;
    }

    setViewerCount(initialCountRef.current);

    // Animate in after a short delay
    const showTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    // Use fixed interval for predictable behavior and proper cleanup
    const fluctuateInterval = setInterval(() => {
      setViewerCount(prev => {
        const change = Math.random();
        let newCount = prev;

        if (change < 0.25 && prev > 2) {
          newCount = prev - 1; // 25% chance to decrease
        } else if (change > 0.75 && prev < 12) {
          newCount = prev + 1; // 25% chance to increase
        }
        // 50% chance to stay the same

        if (newCount !== prev) {
          setPrevCount(prev);
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 300);
        }

        return newCount;
      });
    }, 8000); // 8-second interval for more dynamic feel

    return () => {
      clearTimeout(showTimeout);
      clearInterval(fluctuateInterval);
    };
  }, [baseCount]);

  if (!isVisible || viewerCount === 0) return null;

  const isIncreasing = viewerCount > prevCount;

  // Compact version — sits over product imagery, so it is always light-on-dark
  if (compact) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label={`${viewerCount} người ${VIEWING} sản phẩm này`}
        className={`inline-flex items-center rounded-pill border border-white/14 bg-navy/70 px-2.5 py-1 backdrop-blur-sm ${className}`}
      >
        <span className="text-xs font-semibold tabular-nums text-white">{viewerCount}</span>
      </div>
    );
  }

  // Pill shell: matches Eyebrow's hairline-border-on-surface treatment, with the
  // accent bleeding in as attention rises.
  const shellByLevel: Record<HotLevel, string> = onDark
    ? {
      normal: 'border-white/14 bg-white/10 text-white',
      warm: 'border-accent/40 bg-accent/15 text-white',
      hot: 'border-accent/60 bg-accent/25 text-white',
    }
    : {
      normal: 'border-navy/14 bg-surface text-navy',
      warm: 'border-accent/30 bg-accent/8 text-navy',
      hot: 'border-accent/45 bg-accent/14 text-navy',
    };

  const dotColor = hotLevel === 'normal' ? 'bg-success' : 'bg-accent';
  const labelColor = onDark ? 'text-white/70' : 'text-ink';

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`${viewerCount} người ${VIEWING} sản phẩm này`}
      className={`group relative ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={`inline-flex items-center gap-2.5 rounded-pill border px-3 py-2 leading-none transition-colors duration-300 ease-brand sm:px-4 ${shellByLevel[hotLevel]}`}
      >
        {/* Avatar stack */}
        {showAvatars && avatars.length > 0 && (
          <div className="flex -space-x-1.5">
            {avatars.map((avatar, index) => (
              <span
                key={index}
                aria-hidden="true"
                className={`flex h-5 w-5 items-center justify-center rounded-pill bg-gradient-to-br text-[8px] font-bold text-white sm:h-6 sm:w-6 sm:text-[9px] ${avatar.tint} ${
                  onDark ? 'ring-1 ring-navy/40' : 'ring-1 ring-background'
                }`}
                style={{ zIndex: avatars.length - index }}
              >
                {avatar.initial}
              </span>
            ))}
            {viewerCount > 4 && (
              <span
                aria-hidden="true"
                className={`flex h-5 w-5 items-center justify-center rounded-pill text-[8px] font-bold sm:h-6 sm:w-6 sm:text-[9px] ${
                  onDark
                    ? 'bg-white/20 text-white ring-1 ring-navy/40'
                    : 'bg-navy/10 text-navy ring-1 ring-background'
                }`}
                style={{ zIndex: 0 }}
              >
                +{viewerCount - 4}
              </span>
            )}
          </div>
        )}

        {/* Live indicator dot */}
        <span aria-hidden="true" className="relative flex h-2 w-2 shrink-0">
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-pill opacity-60 ${dotColor}`} />
          <span className={`relative inline-flex h-2 w-2 rounded-pill ${dotColor}`} />
        </span>

        {/* Count and label */}
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-4 items-center overflow-hidden">
            <span
              className={`text-sm font-bold tabular-nums sm:text-base ${
                isAnimating ? (isIncreasing ? 'animate-slide-up-visitor' : 'animate-slide-down-visitor') : ''
              }`}
            >
              {viewerCount}
            </span>
          </span>

          <span className={`text-xs font-medium sm:text-sm ${labelColor}`}>người {VIEWING}</span>

          {hotLevel === 'hot' && (
            <span className="ml-0.5 hidden rounded-pill bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white sm:inline-block">
              Hot
            </span>
          )}
        </span>
      </div>

      {/* Tooltip — navy card, the brand's inverse surface */}
      {showTooltip && (
        <div
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-[16rem] -translate-x-1/2 rounded-card border border-white/14 bg-navy px-3 py-2.5 shadow-xl"
          style={{ animation: 'fade-in-up 0.2s var(--ease-brand)' }}
        >
          <p className="flex items-center gap-2 text-xs font-semibold text-white">
            <svg className="h-3.5 w-3.5 shrink-0 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Đang được quan tâm
          </p>
          <p className="mt-1 text-[11px] leading-[1.5] text-white/70">
            {viewerCount} người {VIEWING} sản phẩm này ngay bây giờ.
          </p>
          {hotLevel !== 'normal' && (
            <p className="mt-1 text-[11px] font-medium leading-[1.5] text-accent-light">
              Sản phẩm được nhiều người quan tâm.
            </p>
          )}
          {/* Arrow */}
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b border-r border-white/14 bg-navy"
          />
        </div>
      )}
    </div>
  );
}
