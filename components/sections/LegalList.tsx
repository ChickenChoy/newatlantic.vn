import type { ReactNode } from 'react';

export type LegalListTone = 'accent' | 'negative';

export interface LegalListProps {
  items: ReactNode[];
  /** `negative` marks exclusions — what a clause explicitly does not cover. */
  tone?: LegalListTone;
  className?: string;
}

/**
 * The bullet list used through the legal pages: a small marker on the brand
 * accent, aligned to the first line of each item however long it wraps.
 */
export default function LegalList({ items, tone = 'accent', className = '' }: LegalListProps) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className={`mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-pill ${
              tone === 'negative' ? 'bg-[var(--error)]' : 'bg-accent'
            }`}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
