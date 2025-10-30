'use client';

import { ReactNode } from 'react';

interface ShineEffectProps {
  children: ReactNode;
  className?: string;
  color?: string;
  duration?: number;
}

export default function ShineEffect({
  children,
  className = '',
  color = 'rgba(255, 255, 255, 0.6)',
  duration = 1.5,
}: ShineEffectProps) {
  return (
    <div className={`relative overflow-hidden group ${className}`}>
      {children}

      {/* Shine overlay */}
      <div
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          transitionDuration: `${duration}s`,
          transitionTimingFunction: 'ease-in-out',
        }}
      />
    </div>
  );
}

