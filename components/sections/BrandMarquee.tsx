import Image from 'next/image';
import Marquee from '../motion/Marquee';

export interface BrandLogo {
  id: string;
  name: string;
  logo: string;
  url?: string;
}

export interface BrandMarqueeProps {
  logos: BrandLogo[];
  /** Small line above the row. */
  label?: string;
  onDark?: boolean;
  /** Seconds for one full pass. */
  speed?: number;
  className?: string;
}

/**
 * The template's trusted-by row: a continuous logo scroller under a short
 * label. Logos are greyed back and come up to full strength on hover.
 */
export default function BrandMarquee({
  logos,
  label,
  onDark = false,
  speed = 36,
  className = '',
}: BrandMarqueeProps) {
  if (logos.length === 0) return null;

  return (
    <div className={className}>
      {label && (
        <p
          className={`mb-10 text-center text-sm uppercase tracking-[0.14em] ${
            onDark ? 'text-white/60' : 'text-muted'
          }`}
        >
          {label}
        </p>
      )}

      <Marquee speed={speed} gap={60}>
        {logos.map(logo => {
          const mark = (
            <div className="relative h-10 w-[130px] shrink-0 opacity-60 transition-opacity duration-300 ease-brand hover:opacity-100 md:h-12 md:w-[150px]">
              <Image
                src={logo.logo}
                alt={logo.name}
                fill
                sizes="150px"
                className={`object-contain ${onDark ? 'brightness-0 invert' : ''}`}
              />
            </div>
          );

          return logo.url ? (
            <a
              key={logo.id}
              href={logo.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={logo.name}
              className="shrink-0"
            >
              {mark}
            </a>
          ) : (
            <div key={logo.id} className="shrink-0">
              {mark}
            </div>
          );
        })}
      </Marquee>
    </div>
  );
}
