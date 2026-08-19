import type { ReactNode } from 'react';
import Reveal from '../motion/Reveal';

export interface LegalSectionProps {
  /** Clause number, shown in the accent marker beside the heading. */
  index: number;
  title: string;
  children: ReactNode;
  /** Anchor target so a clause can be linked to directly. */
  id?: string;
  className?: string;
}

/**
 * One numbered clause of a legal document (privacy policy, terms of service).
 *
 * A hairline rule down the left edge carries the eye through the document and
 * the accent marker numbers each clause, which is what keeps a long page of
 * body copy legible without the card-in-card nesting the old pages used.
 */
export default function LegalSection({
  index,
  title,
  children,
  id,
  className = '',
}: LegalSectionProps) {
  return (
    <Reveal className={`border-l border-navy/14 pl-6 md:pl-10 ${className}`}>
      <section id={id}>
        <h2 className="mb-6 flex items-center gap-4 font-display text-d5 uppercase leading-display tracking-display text-navy">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-accent font-body text-base font-semibold tracking-normal text-white"
          >
            {index}
          </span>
          {title}
        </h2>

        <div className="space-y-4 text-base leading-[1.6] text-ink">{children}</div>
      </section>
    </Reveal>
  );
}
