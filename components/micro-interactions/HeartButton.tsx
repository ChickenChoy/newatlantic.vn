'use client';

import { useState } from 'react';

interface HeartButtonProps {
  isLiked?: boolean;
  onToggle?: (liked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function HeartButton({
  isLiked: controlledLiked,
  onToggle,
  size = 'md',
  className = '',
}: HeartButtonProps) {
  const [internalLiked, setInternalLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const isLiked = controlledLiked !== undefined ? controlledLiked : internalLiked;

  const handleClick = () => {
    const newValue = !isLiked;
    
    if (controlledLiked === undefined) {
      setInternalLiked(newValue);
    }

    // Trigger animation
    if (newValue) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }

    onToggle?.(newValue);
  };

  const sizeStyles = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <button
      onClick={handleClick}
      className={`
        relative group p-2 rounded-full transition-all duration-300
        hover:bg-red-50 active:scale-90
        ${className}
      `}
      aria-label={isLiked ? 'Unlike' : 'Like'}
    >
      {/* Heart Icon */}
      <svg
        className={`
          ${sizeStyles[size]} transition-all duration-300
          ${isLiked ? 'text-red-500 scale-100' : 'text-gray-400 group-hover:text-red-400'}
          ${isAnimating ? 'animate-heart-beat' : ''}
        `}
        fill={isLiked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>

      {/* Particles on like */}
      {isAnimating && (
        <>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-500 rounded-full animate-particle"
              style={{
                '--angle': `${i * 45}deg`,
                animationDelay: `${i * 0.05}s`,
              } as React.CSSProperties}
            />
          ))}
        </>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes heart-beat {
          0%, 100% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.3);
          }
          50% {
            transform: scale(0.9);
          }
          75% {
            transform: scale(1.2);
          }
        }
        
        @keyframes particle {
          0% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateY(20px) scale(0);
            opacity: 0;
          }
        }

        .animate-heart-beat {
          animation: heart-beat 0.6s ease-in-out;
        }

        .animate-particle {
          animation: particle 0.6s ease-out forwards;
        }
      `}</style>
    </button>
  );
}

