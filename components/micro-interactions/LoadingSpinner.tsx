'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
  className?: string;
}

export default function LoadingSpinner({
  size = 'md',
  color = '#5f7ab8',
  variant = 'spinner',
  className = '',
}: LoadingSpinnerProps) {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  if (variant === 'spinner') {
    return (
      <div className={`${sizeStyles[size]} ${className}`}>
        <svg
          className="animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke={color}
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill={color}
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={`flex items-center justify-center gap-2 ${className}`}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`rounded-full ${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-5 h-5'} animate-bounce`}
            style={{
              backgroundColor: color,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`relative ${sizeStyles[size]} ${className}`}>
        <div
          className="absolute inset-0 rounded-full animate-ping"
          style={{ backgroundColor: color, opacity: 0.3 }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    );
  }

  if (variant === 'bars') {
    return (
      <div className={`flex items-end justify-center gap-1 ${sizeStyles[size]} ${className}`}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-1 rounded-full animate-bars"
            style={{
              backgroundColor: color,
              height: '100%',
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
        <style jsx>{`
          @keyframes bars {
            0%, 100% {
              transform: scaleY(0.3);
            }
            50% {
              transform: scaleY(1);
            }
          }
          .animate-bars {
            animation: bars 1s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  return null;
}

