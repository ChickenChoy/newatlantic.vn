'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  DISTANCE_REVEAL,
  DURATION_REVEAL,
  EASE_BRAND,
  offsetFor,
  type RevealDirection,
} from './ease';

interface RevealProps {
  children: React.ReactNode;
  /** Where the element travels from. Defaults to rising up into place. */
  direction?: RevealDirection;
  /** Delay before the reveal starts, in milliseconds. */
  delay?: number;
  /** Travel distance in pixels. */
  distance?: number;
  /** Duration in seconds. */
  duration?: number;
  /** Replay the reveal each time the element re-enters the viewport. */
  repeat?: boolean;
  className?: string;
}

/**
 * Reveals its children once they scroll into view.
 *
 * Prop-compatible with the older `ScrollAnimation` component (`direction`,
 * `delay` in ms, `className`) so call sites migrate by changing the import.
 */
export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  distance = DISTANCE_REVEAL,
  duration = DURATION_REVEAL,
  repeat = false,
  className,
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const from = offsetFor(direction, distance);

  // Readers who ask for less motion get the content, immediately, with no
  // transform and no opacity fade.
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: from.x, y: from.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: !repeat, amount: 0.15, margin: '0px 0px -50px 0px' }}
      transition={{ duration, ease: EASE_BRAND, delay: delay / 1000 }}
    >
      {children}
    </motion.div>
  );
}
