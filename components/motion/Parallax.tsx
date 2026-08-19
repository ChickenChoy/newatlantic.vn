'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

interface ParallaxProps {
  children: React.ReactNode;
  /**
   * Pixels of drift across the element's full pass through the viewport.
   * Negative values move against the scroll direction.
   */
  offset?: number;
  className?: string;
}

/**
 * Drifts its children vertically as the element passes through the viewport.
 *
 * Intended for hero and section background media only. Applying this to text
 * costs legibility for very little visual gain, so keep offsets small.
 */
export default function Parallax({
  children,
  offset = 60,
  className,
}: ParallaxProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  if (reduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
