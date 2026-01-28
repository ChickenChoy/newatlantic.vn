'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

interface LiveVisitorCountProps {
  productId: string;
  className?: string;
  showAvatars?: boolean;
  compact?: boolean;
}

// Avatar colors for fake viewers
const AVATAR_COLORS = [
  'from-pink-500 to-rose-500',
  'from-purple-500 to-indigo-500',
  'from-blue-500 to-cyan-500',
  'from-green-500 to-emerald-500',
  'from-yellow-500 to-orange-500',
  'from-red-500 to-pink-500',
  'from-indigo-500 to-purple-500',
  'from-teal-500 to-green-500',
];

// Avatar initials for fake viewers
const AVATAR_INITIALS = ['ND', 'TH', 'VH', 'MT', 'HL', 'PT', 'AN', 'BT', 'CL', 'DK', 'EL', 'FM'];

/**
 * Enhanced Live Visitor Counter with animations, avatars, and social proof
 * Uses product ID as seed for consistent count across page loads
 */
export default function LiveVisitorCount({
  productId,
  className = '',
  showAvatars = true,
  compact = false
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
      color: AVATAR_COLORS[(seed + i) % AVATAR_COLORS.length],
      initial: AVATAR_INITIALS[(seed + i) % AVATAR_INITIALS.length],
    }));
  }, [productId, viewerCount]);

  // Determine hotness level
  const hotLevel = useMemo(() => {
    if (viewerCount >= 8) return 'hot';
    if (viewerCount >= 5) return 'warm';
    return 'normal';
  }, [viewerCount]);

  // Handle count change with animation
  const updateCount = useCallback((newCount: number) => {
    setPrevCount(viewerCount);
    setViewerCount(newCount);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
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

  // Compact version
  if (compact) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label={`${viewerCount} người đang xem sản phẩm này`}
        className={`inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full ${className}`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-xs font-medium text-white tabular-nums">{viewerCount}</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`${viewerCount} người đang xem sản phẩm này`}
      className={`relative group ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Main container with glow effect */}
      <div
        className={`
          inline-flex items-center gap-2.5 
          backdrop-blur-sm border rounded-full
          px-3 py-1.5 sm:px-4 sm:py-2
          transition-all duration-500 ease-out
          ${hotLevel === 'hot'
            ? 'bg-gradient-to-r from-red-500/25 to-orange-500/25 border-red-500/40 shadow-lg shadow-red-500/20'
            : hotLevel === 'warm'
              ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-orange-500/35 shadow-md shadow-orange-500/15'
              : 'bg-gradient-to-r from-emerald-500/15 to-teal-500/15 border-emerald-500/30'
          }
          hover:scale-105 cursor-default
          animate-fade-in
        `}
      >
        {/* Avatar Stack */}
        {showAvatars && avatars.length > 0 && (
          <div className="flex -space-x-2">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`
                  w-5 h-5 sm:w-6 sm:h-6 rounded-full 
                  bg-gradient-to-br ${avatar.color}
                  flex items-center justify-center
                  text-[8px] sm:text-[9px] font-bold text-white
                  border-2 border-white/20
                  shadow-sm
                  transition-transform duration-300
                  hover:scale-110 hover:z-10
                `}
                style={{
                  zIndex: avatars.length - index,
                  animationDelay: `${index * 100}ms`
                }}
              >
                {avatar.initial}
              </div>
            ))}
            {viewerCount > 4 && (
              <div
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-700/80 flex items-center justify-center text-[8px] sm:text-[9px] font-bold text-white border-2 border-white/20"
                style={{ zIndex: 0 }}
              >
                +{viewerCount - 4}
              </div>
            )}
          </div>
        )}

        {/* Live indicator dot */}
        <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
          <span
            className={`
              animate-ping absolute inline-flex h-full w-full rounded-full opacity-75
              ${hotLevel === 'hot' ? 'bg-red-400' : hotLevel === 'warm' ? 'bg-orange-400' : 'bg-emerald-400'}
            `}
          ></span>
          <span
            className={`
              relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3
              ${hotLevel === 'hot' ? 'bg-red-500' : hotLevel === 'warm' ? 'bg-orange-500' : 'bg-emerald-500'}
            `}
          ></span>
        </span>

        {/* Animated number and text */}
        <div className="flex items-center gap-1.5">
          {/* Number with flip animation */}
          <div className="relative overflow-hidden h-5 sm:h-6">
            <span
              className={`
                inline-flex items-center font-bold tabular-nums text-sm sm:text-base
                transition-all duration-300 ease-out
                ${hotLevel === 'hot' ? 'text-red-400' : hotLevel === 'warm' ? 'text-orange-400' : 'text-emerald-400'}
                ${isAnimating
                  ? isIncreasing
                    ? 'animate-slide-up-visitor'
                    : 'animate-slide-down-visitor'
                  : ''
                }
              `}
            >
              {viewerCount}
            </span>

            {/* Change indicator */}
            {isAnimating && (
              <span
                className={`
                  absolute -right-3 top-0 text-[10px] font-bold
                  ${isIncreasing ? 'text-green-400 animate-bounce-up-visitor' : 'text-red-400 animate-bounce-down-visitor'}
                `}
              >
                {isIncreasing ? '↑' : '↓'}
              </span>
            )}
          </div>

          {/* Text */}
          <span
            className={`
              text-xs sm:text-sm font-medium
              ${hotLevel === 'hot' ? 'text-red-200' : hotLevel === 'warm' ? 'text-orange-200' : 'text-emerald-200'}
            `}
          >
            người đang xem
          </span>

          {/* Hot badge */}
          {hotLevel === 'hot' && (
            <span className="inline-flex items-center gap-0.5 bg-red-500/30 px-1.5 py-0.5 rounded text-[10px] font-bold text-red-300 animate-pulse">
              🔥 HOT
            </span>
          )}
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="
            absolute bottom-full left-1/2 -translate-x-1/2 mb-2
            bg-gray-900/95 backdrop-blur-sm rounded-lg
            px-3 py-2 text-xs text-white
            shadow-xl border border-white/10
            whitespace-nowrap z-50
          "
          style={{ animation: 'fade-in-up 0.2s ease-out' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="font-semibold">Đang được quan tâm!</span>
          </div>
          <p className="text-gray-300 text-[11px]">
            {viewerCount} người đang xem sản phẩm này ngay bây giờ
          </p>
          {hotLevel !== 'normal' && (
            <p className="text-yellow-400 text-[11px] mt-1 flex items-center gap-1">
              <span>⚡</span> Sản phẩm được nhiều người quan tâm
            </p>
          )}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="border-8 border-transparent border-t-gray-900/95"></div>
          </div>
        </div>
      )}
    </div>
  );
}
