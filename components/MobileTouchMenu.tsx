'use client';

import { useRef } from 'react';

interface MobileTouchMenuProps {
  children: React.ReactNode;
  className?: string;
}

export default function MobileTouchMenu({ children, className = '' }: MobileTouchMenuProps) {
  // Use refs instead of state to avoid re-renders on every touch move
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.targetTouches[0].clientY;
    touchEndY.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = () => {
    // Touch handling is now just for gesture detection
    // The actual menu state is managed by parent component
  };

  return (
    <div
      className={`relative ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
}
