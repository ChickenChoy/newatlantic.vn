import Link from 'next/link';
import Image from 'next/image';
import type { ReactNode } from 'react';

export interface ServiceCardProps {
  title: string;
  description: string;
  /** Sequence label, shown as the template's oversized ghost number. */
  index?: number;
  /** Inline SVG or icon node, dropped into the accent circle. */
  icon?: ReactNode;
  /** Photograph shown above the copy, at the card's 10px radius. */
  image?: string;
  href?: string;
  /** Label for the trailing link. Defaults to the Vietnamese "read more". */
  linkText?: string;
  className?: string;
}

/**
 * The template's service card: white surface, 10px radius, hairline brand
 * border, a display title, and a trailing arrow link that slides on hover.
 */
export default function ServiceCard({
  title,
  description,
  index,
  icon,
  image,
  href,
  linkText = 'Tìm hiểu thêm',
  className = '',
}: ServiceCardProps) {
  const body = (
    <>
      {image && (
        <div className="relative mb-6 aspect-[4/3] w-full overflow-hidden rounded-card bg-surface">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-[400ms] ease-brand group-hover:scale-105"
          />
        </div>
      )}

      {(icon || typeof index === 'number') && (
        <div
          className={`mb-6 flex items-center gap-4 ${icon ? 'justify-between' : 'justify-start'}`}
        >
          {icon && (
            <span className="flex h-14 w-14 items-center justify-center rounded-pill bg-accent text-white transition-transform duration-300 ease-brand group-hover:scale-105">
              {icon}
            </span>
          )}

          {typeof index === 'number' && (
            <span
              aria-hidden="true"
              className="font-display ghost-numeral transition-colors duration-300 ease-brand"
            >
              {String(index).padStart(2, '0')}
            </span>
          )}
        </div>
      )}

      <h3 className="font-display mb-3 text-d5 uppercase leading-display tracking-display text-navy">
        {title}
      </h3>

      <p className="text-base leading-[1.6] text-ink">{description}</p>

      {href && (
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy transition-colors duration-300 ease-brand group-hover:text-accent">
          {linkText}
          <svg
            className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m0 0l-6-6m6 6l-6 6" />
          </svg>
        </span>
      )}
    </>
  );

  const shell = `group flex h-full flex-col rounded-card border border-navy/14 bg-background p-8 transition-colors duration-300 ease-brand hover:border-navy/30 ${className}`;

  if (href) {
    return (
      <Link href={href} className={shell}>
        {body}
      </Link>
    );
  }

  return <div className={shell}>{body}</div>;
}
