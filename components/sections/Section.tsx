import type { ReactNode } from 'react';
import SurfaceBackdrop from './SurfaceBackdrop';

export type SectionTone = 'light' | 'surface' | 'navy';

const TONE_CLASS: Record<SectionTone, string> = {
  light: 'bg-background text-ink',
  surface: 'bg-surface text-ink',
  navy: 'bg-navy text-white/80',
};

export interface SectionProps {
  children: ReactNode;
  /** Background treatment. `navy` also flips the text defaults to light-on-dark. */
  tone?: SectionTone;
  /** Drop the 1200px inner container when a child needs to bleed to the edges. */
  bleed?: boolean;
  /** Anchor target, used by the homepage nav and in-page links. */
  id?: string;
  /**
   * Background photograph for `tone="navy"`, laid under the scrim. Ignored on the
   * light tones, where a dark backdrop would fight the copy.
   */
  image?: string;
  /** Looping background clip for `tone="navy"`. `image` doubles as its poster. */
  video?: string;
  /** Poster frame for `video`, when it differs from `image`. */
  poster?: string;
  className?: string;
  innerClassName?: string;
}

/**
 * The template's section shell: 120px vertical rhythm, 30px gutter, and a
 * 1200px content column. Every page block is composed inside one of these so
 * the vertical spacing stays identical across routes.
 *
 * Navy sections always get the shared backdrop material — gradients, dot mesh and
 * a specular seam — with or without a photograph, so no dark band on the site is
 * ever just flat colour.
 */
export default function Section({
  children,
  tone = 'light',
  bleed = false,
  id,
  image,
  video,
  poster,
  className = '',
  innerClassName = '',
}: SectionProps) {
  const isNavy = tone === 'navy';

  return (
    <section
      id={id}
      className={`${TONE_CLASS[tone]} py-section ${isNavy ? 'relative isolate overflow-hidden' : ''} ${className}`}
    >
      {isNavy && <SurfaceBackdrop image={image} video={video} poster={poster} />}

      {bleed ? (
        children
      ) : (
        <div className={`relative mx-auto w-full max-w-site px-5 md:px-gutter ${innerClassName}`}>
          {children}
        </div>
      )}
    </section>
  );
}
