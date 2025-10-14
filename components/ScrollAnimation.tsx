'use client';

import { useEffect, useRef, useState } from 'react';

interface ScrollAnimationProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  className?: string;
}

export default function ScrollAnimation({ 
  children, 
  direction = 'left', 
  delay = 0,
  className = '' 
}: ScrollAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Optionally unobserve after animation
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  const getTransform = () => {
    switch (direction) {
      case 'left':
        return 'translateX(-100px)';
      case 'right':
        return 'translateX(100px)';
      case 'up':
        return 'translateY(-100px)';
      case 'down':
        return 'translateY(100px)';
      default:
        return 'translateX(-100px)';
    }
  };

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0)' : getTransform(),
        transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

