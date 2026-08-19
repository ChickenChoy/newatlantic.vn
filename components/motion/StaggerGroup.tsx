'use client';

import { Children, isValidElement } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  DISTANCE_REVEAL,
  DURATION_REVEAL,
  EASE_BRAND,
  offsetFor,
  type RevealDirection,
} from './ease';

interface StaggerGroupProps {
  children: React.ReactNode;
  /** Gap between consecutive child reveals, in milliseconds. */
  stagger?: number;
  /** Delay before the first child reveals, in milliseconds. */
  delay?: number;
  direction?: RevealDirection;
  distance?: number;
  duration?: number;
  className?: string;
}

/**
 * Reveals its direct children one after another as the group scrolls into view.
 *
 * Each direct child is wrapped automatically, so grids and card rows do not
 * need a per-item wrapper component at the call site.
 */
export default function StaggerGroup({
  children,
  stagger = 80,
  delay = 0,
  direction = 'up',
  distance = DISTANCE_REVEAL,
  duration = DURATION_REVEAL,
  className,
}: StaggerGroupProps) {
  const reduceMotion = useReducedMotion();
  const from = offsetFor(direction, distance);

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  // Skip null/false branches so conditional children do not consume a step
  // in the stagger sequence and leave a visible gap in the rhythm.
  const items = Children.toArray(children).filter(isValidElement);

  return (
    <div className={className}>
      {items.map((child, index) => (
        <motion.div
          key={child.key ?? index}
          initial={{ opacity: 0, x: from.x, y: from.y }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.15, margin: '0px 0px -50px 0px' }}
          transition={{
            duration,
            ease: EASE_BRAND,
            delay: (delay + index * stagger) / 1000,
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
