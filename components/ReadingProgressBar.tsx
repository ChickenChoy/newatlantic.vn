'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

interface ReadingProgressBarProps {
  color?: string;
  height?: number;
  showPercentage?: boolean;
}

export default function ReadingProgressBar({
  color = 'from-cyan-500 via-blue-500 to-teal-500',
  height = 4,
  showPercentage = true,
}: ReadingProgressBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      // Show progress bar after scrolling past 100px
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-[100] pointer-events-none"
    >
      {/* Progress Bar */}
      <motion.div
        className={`h-[${height}px] bg-gradient-to-r ${color} origin-left`}
        style={{ scaleX }}
      />

      {/* Percentage Indicator */}
      {showPercentage && (
        <motion.div
          className="absolute top-6 right-4 bg-white/10 backdrop-blur-md rounded-full px-3 py-1 text-xs font-medium text-white border border-white/20"
          style={{ opacity: scaleX }}
        >
          <ProgressPercentage scrollYProgress={scrollYProgress} />
        </motion.div>
      )}

      {/* Glow Effect */}
      <div
        className={`h-[${height}px] bg-gradient-to-r ${color} blur-sm opacity-50 origin-left`}
        style={{ transform: 'scaleX(var(--scale))' }}
      />
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
