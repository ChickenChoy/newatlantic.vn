'use client';

import { useState, useEffect } from 'react';

interface FloatingActionButtonProps {
  icon?: React.ReactNode;
  onClick?: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  showOnScroll?: boolean;
  scrollThreshold?: number;
  className?: string;
  tooltip?: string;
}

export default function FloatingActionButton({
  icon,
  onClick,
  position = 'bottom-right',
  showOnScroll = true,
  scrollThreshold = 300,
  className = '',
  tooltip,
}: FloatingActionButtonProps) {
  const [isVisible, setIsVisible] = useState(!showOnScroll);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (!showOnScroll) return;

    const handleScroll = () => {
      setIsVisible(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [showOnScroll, scrollThreshold]);

  const positionStyles = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  const tooltipPosition = {
    'bottom-right': 'right-full mr-3 top-1/2 -translate-y-1/2',
    'bottom-left': 'left-full ml-3 top-1/2 -translate-y-1/2',
    'top-right': 'right-full mr-3 top-1/2 -translate-y-1/2',
    'top-left': 'left-full ml-3 top-1/2 -translate-y-1/2',
  };

  return (
    <div
      className={`
        fixed z-50 transition-all duration-300
        ${positionStyles[position]}
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'}
      `}
    >
      <div className="relative group">
        {/* Tooltip */}
        {tooltip && showTooltip && (
          <div
            className={`
              absolute whitespace-nowrap px-3 py-2 bg-gray-900 text-white text-sm rounded-lg
              opacity-0 group-hover:opacity-100 transition-opacity duration-200
              ${tooltipPosition[position]}
            `}
          >
            {tooltip}
            {/* Arrow */}
            <div
              className={`
                absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45
                ${position.includes('right') ? '-right-1' : '-left-1'}
              `}
            />
          </div>
        )}

        {/* Button */}
        <button
          onClick={onClick}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={`
            w-14 h-14 rounded-full bg-gradient-to-r from-[#5f7ab8] to-[#4a6199]
            text-white shadow-lg hover:shadow-2xl
            flex items-center justify-center
            transition-all duration-300
            hover:scale-110 active:scale-95
            animate-float
            ${className}
          `}
        >
          {icon || (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          )}
        </button>

        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-full bg-[#5f7ab8] opacity-30 animate-ping" />
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

