import Image from 'next/image';
import type { ReactNode } from 'react';
import Eyebrow from './Eyebrow';
import Reveal from '../motion/Reveal';

export interface CTABandProps {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  /** One or two ArrowButtons. */
  actions?: ReactNode;
  /** Optional photograph under the navy scrim. */
  image?: string;
  /** `accent` swaps the deep navy band for the solid brand blue. */
  tone?: 'navy' | 'accent';
  className?: string;
}

/**
 * The closing band every template page ends on: full-width colour, a single
 * oversized line, and the primary call to action.
 */
export default function CTABand({
  eyebrow,
  title,
  intro,
  actions,
  image,
  tone = 'navy',
  className = '',
}: CTABandProps) {
  return (
    <section
      className={`relative isolate overflow-hidden py-section ${
        tone === 'accent' ? 'bg-accent' : 'bg-navy'
      } ${className}`}
    >
      {image && (
        <>
          <Image src={image} alt="" fill className="-z-20 object-cover" />
          <div
            aria-hidden="true"
            className={`absolute inset-0 -z-10 ${tone === 'accent' ? 'bg-accent/85' : 'bg-navy/85'}`}
          />
        </>
      )}

      <div className="mx-auto w-full max-w-site px-5 md:px-gutter">
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          {eyebrow && <Eyebrow onDark>{eyebrow}</Eyebrow>}

          <h2 className="font-display text-d3 uppercase leading-display tracking-display text-white">
            {title}
          </h2>

          {intro && <p className="text-base leading-[1.6] text-white/80 md:text-lg">{intro}</p>}

          {actions && <div className="mt-2 flex flex-wrap items-center justify-center gap-4">{actions}</div>}
        </Reveal>
      </div>
    </section>
  );
}
