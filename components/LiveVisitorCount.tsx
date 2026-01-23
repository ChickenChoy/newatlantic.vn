'use client';

import { useState, useEffect, useRef, useMemo } from 'react';

interface LiveVisitorCountProps {
  productId: string;
  className?: string;
}

/**
 * Displays a live visitor count indicator with animated fluctuation
 * Uses product ID as seed for consistent count across page loads
 */
export default function LiveVisitorCount({ productId, className = '' }: LiveVisitorCountProps) {
  const [viewerCount, setViewerCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const initialCountRef = useRef<number | null>(null);

  // Memoize seed-based count calculation
  const baseCount = useMemo(() => {
    const seed = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (seed % 7) + 2; // 2-8 base viewers
  }, [productId]);

  useEffect(() => {
    // Store initial count
    if (initialCountRef.current === null) {
      initialCountRef.current = baseCount;
    }

    setViewerCount(initialCountRef.current);

    // Animate in after a short delay
    const showTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    // Use fixed interval for predictable behavior and proper cleanup
    const fluctuateInterval = setInterval(() => {
      setViewerCount(prev => {
        const change = Math.random();
        if (change < 0.3 && prev > 1) {
          return prev - 1; // 30% chance to decrease
        } else if (change > 0.7 && prev < 12) {
          return prev + 1; // 30% chance to increase
        }
        return prev; // 40% chance to stay the same
      });
    }, 10000); // Fixed 10-second interval

    return () => {
      clearTimeout(showTimeout);
      clearInterval(fluctuateInterval);
    };
  }, [baseCount]);

  if (!isVisible || viewerCount === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`${viewerCount} người đang xem sản phẩm này`}
      className={`inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30 px-3 py-1.5 rounded-full animate-fade-in ${className}`}
    >
      {/* Animated dot */}
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
      </span>

      {/* Eye icon */}
      <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>

      {/* Text */}
      <span className="text-xs sm:text-sm font-medium text-orange-200">
        <span className="font-bold text-orange-400 tabular-nums">{viewerCount}</span>
        <span className="ml-1">người đang xem</span>
      </span>
    </div>
  );
}
