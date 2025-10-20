'use client';

import { useState, useRef, ReactNode } from 'react';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  className?: string;
}

export default function PullToRefresh({ children, onRefresh, className = '' }: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.targetTouches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.scrollY === 0 && startY.current > 0) {
      const currentY = e.targetTouches[0].clientY;
      const distance = currentY - startY.current;
      
      if (distance > 0) {
        e.preventDefault();
        setPullDistance(Math.min(distance, 100));
        setIsPulling(distance > 20);
      }
    }
  };

  const handleTouchEnd = async () => {
    if (isPulling && pullDistance > 50) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setPullDistance(0);
    setIsPulling(false);
    startY.current = 0;
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateY(${pullDistance * 0.5}px)`,
        transition: isRefreshing ? 'transform 0.3s ease-out' : 'none'
      }}
    >
      {/* Pull Indicator */}
      <div 
        className={`absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-300 ${
          isPulling ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ height: `${Math.min(pullDistance, 100)}px` }}
      >
        <div className="flex items-center space-x-2 text-[#5f7ab8]">
          {isRefreshing ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-[#5f7ab8] border-t-transparent rounded-full"></div>
              <span className="text-sm font-medium">Đang tải...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm font-medium">
                {pullDistance > 50 ? 'Thả để làm mới' : 'Kéo để làm mới'}
              </span>
            </>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}
