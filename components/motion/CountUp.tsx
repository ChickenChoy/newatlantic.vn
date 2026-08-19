'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface CountUpProps {
  end: number;
  /** Duration in milliseconds. */
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  decimals?: number;
}

/**
 * Counts up to `end` when scrolled into view.
 *
 * Supersedes `AnimatedCounter` with the same prop shape, so stat blocks migrate
 * by changing the import. Numbers keep Vietnamese thousands separators.
 */
export default function CountUp({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
  className,
  decimals = 0,
}: CountUpProps) {
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(reduceMotion ? end : 0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);
  const frame = useRef<number>(0);

  useEffect(() => {
    // The final number is the content. If motion is unwanted, show it outright.
    if (reduceMotion) {
      setCount(end);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || hasRun.current) continue;
          hasRun.current = true;
          observer.disconnect();

          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            // easeOutExpo: fast off the mark, settling gently on the value.
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setCount(end * eased);
            if (progress < 1) {
              frame.current = requestAnimationFrame(tick);
            } else {
              setCount(end);
            }
          };
          frame.current = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [end, duration, reduceMotion]);

  const display =
    decimals > 0
      ? count.toFixed(decimals)
      : Math.floor(count).toLocaleString('vi-VN');

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
