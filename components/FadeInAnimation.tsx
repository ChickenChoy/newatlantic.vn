'use client';

import { useEffect, useState } from 'react';

interface FadeInAnimationProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down' | 'none';
  delay?: number;
  className?: string;
}

export default function FadeInAnimation({ 
  children, 
  direction = 'none', 
  delay = 0,
  className = '' 
}: FadeInAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50); // Small delay to ensure animation plays

    return () => clearTimeout(timer);
  }, []);

  const getTransform = () => {
    switch (direction) {
      case 'left':
        return 'translateX(-60px)';
      case 'right':
        return 'translateX(60px)';
      case 'up':
        return 'translateY(-60px)';
      case 'down':
        return 'translateY(60px)';
      default:
        return 'scale(0.95)';
    }
  };

  return (
    <div
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0) scale(1)' : getTransform(),
        transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

