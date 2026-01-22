'use client';

interface MobileTouchMenuProps {
  children: React.ReactNode;
  className?: string;
}

// Simple wrapper component for mobile menu button
// Touch gesture detection was removed to fix performance issues
// (setState on every touchMove caused lag)
export default function MobileTouchMenu({ children, className = '' }: MobileTouchMenuProps) {
  return (
    <div className={`relative ${className}`}>
      {children}
    </div>
  );
}
