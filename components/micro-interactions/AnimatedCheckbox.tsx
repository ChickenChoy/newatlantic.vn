'use client';

import { useState } from 'react';

interface AnimatedCheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  className?: string;
  color?: string;
}

export default function AnimatedCheckbox({
  checked: controlledChecked,
  onChange,
  label,
  className = '',
  color = '#5f7ab8',
}: AnimatedCheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(false);

  const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked;

  const handleChange = () => {
    const newValue = !isChecked;
    if (controlledChecked === undefined) {
      setInternalChecked(newValue);
    }
    onChange?.(newValue);
  };

  return (
    <label className={`inline-flex items-center gap-3 cursor-pointer group ${className}`}>
      <div className="relative">
        {/* Hidden input */}
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          className="sr-only"
        />

        {/* Custom checkbox */}
        <div
          className={`
            w-6 h-6 rounded-md border-2 transition-all duration-300 flex items-center justify-center
            ${
              isChecked
                ? 'border-transparent scale-100'
                : 'border-gray-300 group-hover:border-gray-400'
            }
          `}
          style={{
            backgroundColor: isChecked ? color : 'transparent',
          }}
        >
          {/* Checkmark */}
          <svg
            className={`w-4 h-4 text-white transition-all duration-300 ${
              isChecked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
              className="animate-draw-check"
            />
          </svg>
        </div>

        {/* Ripple effect on click */}
        {isChecked && (
          <div
            className="absolute inset-0 rounded-md animate-ping opacity-30"
            style={{ backgroundColor: color }}
          />
        )}
      </div>

      {/* Label */}
      {label && (
        <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
          {label}
        </span>
      )}

      {/* CSS for checkmark animation */}
      <style jsx>{`
        @keyframes draw-check {
          from {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
          }
          to {
            stroke-dasharray: 100;
            stroke-dashoffset: 0;
          }
        }
        .animate-draw-check {
          animation: draw-check 0.3s ease-out;
        }
      `}</style>
    </label>
  );
}

