'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

interface ReadingProgressBarProps {
  /** Hide the floating percentage pill. */
  showPercentage?: boolean;
}

/**
 * Reading position readout for long articles.
 *
 * The progress *bar* itself is rendered globally by `ScrollProgressBar` in
 * `LayoutWrapper`, so this component only adds the percentage pill — two bars
 * pinned to `top-0` would stack on top of each other.
 */
export default function ReadingProgressBar({
  showPercentage = true,
}: ReadingProgressBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      // Show the readout after scrolling past 100px
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!showPercentage) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      aria-hidden="true"
      className="pointer-events-none fixed right-5 top-24 z-[60] rounded-pill bg-navy px-4 py-1.5 text-xs font-semibold tabular-nums text-white md:right-gutter"
    >
      <ProgressPercentage scrollYProgress={progress} />
    </motion.div>
  );
}

function ProgressPercentage({ scrollYProgress }: { scrollYProgress: any }) {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest: number) => {
      setPercentage(Math.round(latest * 100));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return <span>{percentage}%</span>;
}
