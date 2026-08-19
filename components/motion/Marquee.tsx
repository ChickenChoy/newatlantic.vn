'use client';

import { useReducedMotion } from 'framer-motion';

interface MarqueeProps {
  children: React.ReactNode;
  /** Seconds for one full pass. Larger is slower. */
  speed?: number;
  direction?: 'left' | 'right';
  /** Gap between items, in pixels. */
  gap?: number;
  pauseOnHover?: boolean;
  className?: string;
}

/**
 * Continuous horizontal scroller, used for partner and certification logo rows.
 *
 * The track renders its children twice and translates by exactly -50%, so the
 * second copy is in the first copy's starting position at the moment the
 * animation loops. That is what makes the seam invisible.
 */
export default function Marquee({
  children,
  speed = 32,
  direction = 'left',
  gap = 60,
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  const reduceMotion = useReducedMotion();

  // Static, scrollable row when reduced motion is requested: the logos are
  // content, so they must stay reachable rather than being hidden.
  if (reduceMotion) {
    return (
      <div
        className={`flex overflow-x-auto ${className ?? ''}`}
        style={{ gap }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={`group relative overflow-hidden ${className ?? ''}`}
      // Masked edges so logos fade out instead of being cut mid-shape.
      style={{
        maskImage:
          'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <div
        className={`flex w-max ${pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''}`}
        style={{
          gap,
          paddingRight: gap,
          animation: `marquee-${direction} ${speed}s linear infinite`,
        }}
      >
        <div className="flex shrink-0 items-center" style={{ gap }}>
          {children}
        </div>
        <div className="flex shrink-0 items-center" style={{ gap }} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
