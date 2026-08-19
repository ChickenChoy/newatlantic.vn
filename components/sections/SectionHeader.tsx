import type { ReactNode } from 'react';
import Eyebrow from './Eyebrow';
import Reveal from '../motion/Reveal';

export interface SectionHeaderProps {
  /** Small pill label above the heading. */
  eyebrow?: string;
  /** Oversized condensed heading. Pass a string, or nodes to accent one word. */
  title: ReactNode;
  /** One-sentence support line under (or beside) the heading. */
  intro?: ReactNode;
  /** Rendered at the end of the block — normally an ArrowButton. */
  action?: ReactNode;
  /**
   * `split` puts the heading left and the intro/action right, the template's
   * default for wide sections. `center` stacks everything centred.
   */
  layout?: 'split' | 'stacked' | 'center';
  /** Step of the display scale. d3 is the section default; d4 for sub-sections. */
  size?: 'd3' | 'd4' | 'd5';
  onDark?: boolean;
  className?: string;
}

const SIZE_CLASS = {
  d3: 'text-d3 leading-display',
  d4: 'text-d4 leading-display',
  d5: 'text-d5 leading-display',
} as const;

export default function SectionHeader({
  eyebrow,
  title,
  intro,
  action,
  layout = 'split',
  size = 'd3',
  onDark = false,
  className = '',
}: SectionHeaderProps) {
  const heading = (
    <h2
      className={`font-display uppercase tracking-display ${SIZE_CLASS[size]} ${
        onDark ? 'text-white' : 'text-navy'
      }`}
    >
      {title}
    </h2>
  );

  const support = intro ? (
    <p className={`text-base leading-[1.6] ${onDark ? 'text-white/80' : 'text-ink'}`}>{intro}</p>
  ) : null;

  if (layout === 'center') {
    return (
      <Reveal className={`mx-auto flex max-w-3xl flex-col items-center gap-6 text-center ${className}`}>
        {eyebrow && <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow>}
        {heading}
        {support}
        {action}
      </Reveal>
    );
  }

  if (layout === 'stacked') {
    return (
      <Reveal className={`flex max-w-3xl flex-col gap-6 ${className}`}>
        {eyebrow && <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow>}
        {heading}
        {support}
        {action}
      </Reveal>
    );
  }

  return (
    <Reveal className={`flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16 ${className}`}>
      <div className="flex max-w-xl flex-col gap-6">
        {eyebrow && (
          <span>
            <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow>
          </span>
        )}
        {heading}
      </div>
      {(support || action) && (
        <div className="flex max-w-md flex-col items-start gap-6">
          {support}
          {action}
        </div>
      )}
    </Reveal>
  );
}
