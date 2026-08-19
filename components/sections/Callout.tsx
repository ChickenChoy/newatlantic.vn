import type { ReactNode } from 'react';

export type CalloutTone = 'info' | 'warning';

export interface CalloutProps {
  children: ReactNode;
  /** Bold lead-in, e.g. "Lưu ý". */
  label?: string;
  /** `warning` swaps the accent rule for the amber status colour. */
  tone?: CalloutTone;
  className?: string;
}

const RULE_CLASS: Record<CalloutTone, string> = {
  info: 'border-l-accent',
  warning: 'border-l-[var(--warning)]',
};

/**
 * A short aside pulled out of the surrounding body copy — a note, a caveat, a
 * deadline. Surface fill with a thick coloured rule on the leading edge.
 */
export default function Callout({ children, label, tone = 'info', className = '' }: CalloutProps) {
  return (
    <div
      className={`rounded-r-card border-l-4 bg-surface px-6 py-5 text-base leading-[1.6] text-ink ${RULE_CLASS[tone]} ${className}`}
    >
      {label && <strong className="font-semibold text-navy">{label}: </strong>}
      {children}
    </div>
  );
}
