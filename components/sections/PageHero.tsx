import Link from 'next/link';
import type { ReactNode } from 'react';
import Eyebrow from './Eyebrow';
import Reveal from '../motion/Reveal';
import SurfaceBackdrop from './SurfaceBackdrop';

export interface Breadcrumb {
  name: string;
  href?: string;
}

export interface PageHeroProps {
  /** Small pill label above the heading. */
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Trail shown under the heading. The last entry renders as plain text. */
  breadcrumbs?: Breadcrumb[];
  /** Optional background photograph, laid under a navy scrim. */
  image?: string;
  /** Looping background clip. `image` doubles as its poster frame. */
  video?: string;
  /** Poster frame for `video`, when it differs from `image`. */
  poster?: string;
  /** Rendered under the intro — normally one or two ArrowButtons. */
  actions?: ReactNode;
  /** Extra content pinned to the bottom of the hero, e.g. a stat row. */
  footer?: ReactNode;
  /** `d2` for the homepage, `d3` for inner pages. */
  size?: 'd1' | 'd2' | 'd3';
  align?: 'left' | 'center';
  className?: string;
}

const SIZE_CLASS = {
  d1: 'text-d1 leading-display',
  d2: 'text-d2 leading-display',
  d3: 'text-d3 leading-display',
} as const;

/**
 * The template's page header: a navy band (optionally over a photograph) that
 * every route opens with. Top padding clears the fixed nav.
 */
export default function PageHero({
  eyebrow,
  title,
  intro,
  breadcrumbs,
  image,
  video,
  poster,
  actions,
  footer,
  size = 'd3',
  align = 'left',
  className = '',
}: PageHeroProps) {
  const centered = align === 'center';

  return (
    <section
      className={`relative isolate overflow-hidden bg-navy pb-section pt-[104px] md:pt-[152px] ${className}`}
    >
      {/* Every route opens on this band, so it carries the backdrop material even
          when no photograph is supplied. */}
      <SurfaceBackdrop image={image} video={video} poster={poster} priority />

      <div className="relative mx-auto w-full max-w-site px-5 md:px-gutter">
        <Reveal
          className={`flex flex-col gap-6 ${centered ? 'mx-auto max-w-4xl items-center text-center' : 'max-w-4xl'}`}
        >
          {eyebrow && (
            <span>
              <Eyebrow onDark>{eyebrow}</Eyebrow>
            </span>
          )}

          <h1 className={`font-display uppercase tracking-display text-white ${SIZE_CLASS[size]}`}>
            {title}
          </h1>

          {intro && (
            <p className={`text-base leading-[1.6] text-white/80 md:text-lg ${centered ? '' : 'max-w-2xl'}`}>
              {intro}
            </p>
          )}

          {actions && <div className="mt-2 flex flex-wrap items-center gap-4">{actions}</div>}

          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Đường dẫn" className="mt-2">
              <ol className={`flex flex-wrap items-center gap-2 text-sm ${centered ? 'justify-center' : ''}`}>
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1;
                  return (
                    <li key={`${crumb.name}-${index}`} className="flex items-center gap-2">
                      {crumb.href && !isLast ? (
                        <Link
                          href={crumb.href}
                          className="text-white/60 transition-colors duration-300 ease-brand hover:text-accent"
                        >
                          {crumb.name}
                        </Link>
                      ) : (
                        <span className={isLast ? 'text-white' : 'text-white/60'} aria-current={isLast ? 'page' : undefined}>
                          {crumb.name}
                        </span>
                      )}
                      {!isLast && (
                        <span aria-hidden="true" className="text-white/30">
                          /
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          )}
        </Reveal>

        {footer && <div className="mt-12 border-t border-white/14 pt-10">{footer}</div>}
      </div>
    </section>
  );
}
