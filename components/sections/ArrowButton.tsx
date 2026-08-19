import Link from 'next/link';
import type { ReactNode } from 'react';

export type ArrowButtonVariant = 'accent' | 'navy' | 'white' | 'outline' | 'outline-light';

/**
 * The template's signature CTA: a pill whose right end is filled by a 40px
 * circle carrying the arrow. Geometry is taken straight from the template —
 * 19px lead padding, 13px trail, 24px gap, circle inset 5px — so the label and
 * the circle stay optically centred at every label length.
 */
const VARIANT: Record<ArrowButtonVariant, { shell: string; circle: string; arrow: string }> = {
  accent: {
    shell: 'bg-accent text-white hover:bg-accent-dark',
    circle: 'bg-white',
    arrow: 'text-accent',
  },
  navy: {
    shell: 'bg-navy text-white hover:bg-navy-light',
    circle: 'bg-accent',
    arrow: 'text-white',
  },
  white: {
    shell: 'bg-white text-navy hover:bg-surface',
    circle: 'bg-navy',
    arrow: 'text-white',
  },
  outline: {
    shell: 'border border-navy/14 bg-transparent text-navy hover:border-navy',
    circle: 'bg-navy',
    arrow: 'text-white',
  },
  'outline-light': {
    shell: 'border border-white/14 bg-transparent text-white hover:border-white/60',
    circle: 'bg-white',
    arrow: 'text-navy',
  },
};

function Arrow({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m0 0l-6-6m6 6l-6 6" />
    </svg>
  );
}

export interface ArrowButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: ArrowButtonVariant;
  /** Opens in a new tab and adds the matching rel. */
  external?: boolean;
  /** Stretch to the container width, for stacked mobile CTAs. */
  full?: boolean;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

export default function ArrowButton({
  children,
  href,
  onClick,
  variant = 'accent',
  external = false,
  full = false,
  type = 'button',
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
}: ArrowButtonProps) {
  const v = VARIANT[variant];
  const shell = `group relative inline-flex items-center gap-6 rounded-pill py-[13px] pl-[19px] pr-[13px] text-sm font-semibold leading-none transition-colors duration-300 ease-brand disabled:cursor-not-allowed disabled:opacity-60 ${
    full ? 'w-full justify-between' : ''
  } ${v.shell} ${className}`;

  const inner = (
    <>
      {/*
        `min-w-0` is load-bearing, not cosmetic. A flex child defaults to
        `min-width: auto`, i.e. it refuses to shrink below its longest word — so
        in a narrow container (the 264px article sidebar, a stacked mobile CTA)
        the label pushed the flex line wider than the pill and spilled past the
        rounded edge. Worse, it slid under the absolutely-positioned knob below,
        putting white text on a white circle: invisible.

        `break-words` is what actually wraps the long word once `min-w-0` has
        removed the floor. Note the pairing is required: `overflow-wrap` does not
        reduce min-content size on its own, so `break-words` alone is a no-op on
        a flex child.
      */}
      <span className="relative z-10 min-w-0 break-words">{children}</span>
      <span className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center ${v.arrow}`}>
        <Arrow className="h-4 w-4" />
      </span>
      <span
        aria-hidden="true"
        className={`absolute right-[5px] top-1/2 z-0 h-10 w-10 -translate-y-1/2 rounded-pill transition-transform duration-300 ease-brand group-hover:scale-105 ${v.circle}`}
      />
    </>
  );

  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={shell} aria-label={ariaLabel}>
        {inner}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={shell} aria-label={ariaLabel} onClick={onClick}>
        {inner}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={shell} aria-label={ariaLabel}>
      {inner}
    </button>
  );
}
