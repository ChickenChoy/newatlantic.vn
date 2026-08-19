import type { ReactNode } from 'react';

export interface EyebrowProps {
  children: ReactNode;
  /** Light-on-dark variant, for use over navy and photographic backgrounds. */
  onDark?: boolean;
  /** Optional leading icon. Nothing is rendered in its place when omitted. */
  icon?: ReactNode;
  className?: string;
}

/**
 * The template's small pill label that sits above every section heading.
 * Surface fill, hairline brand border, fully rounded.
 */
export default function Eyebrow({ children, onDark = false, icon, className = '' }: EyebrowProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-pill border px-4 py-2 text-sm font-medium leading-none ${
        onDark ? 'border-white/14 bg-white/10 text-white' : 'border-navy/14 bg-surface text-navy'
      } ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}
