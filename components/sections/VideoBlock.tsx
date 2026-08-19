'use client';

import Image from 'next/image';
import { useState } from 'react';

export interface VideoBlockProps {
  /** Poster image shown until the viewer presses play. */
  poster: string;
  /** YouTube/Vimeo embed URL, or a direct file for the native player. */
  src?: string;
  title?: string;
  posterAlt?: string;
  className?: string;
}

/**
 * The template's video block: a wide poster at the card radius with a large
 * accent play button. The player is only mounted on the first press, so the
 * embed costs nothing until it is wanted.
 */
export default function VideoBlock({
  poster,
  src,
  title,
  posterAlt = '',
  className = '',
}: VideoBlockProps) {
  const [playing, setPlaying] = useState(false);
  const isFile = Boolean(src && /\.(mp4|webm|ogg)(\?|$)/i.test(src));

  return (
    <div className={`relative isolate aspect-[16/9] w-full overflow-hidden rounded-card bg-navy ${className}`}>
      {playing && src ? (
        isFile ? (
          <video src={src} controls autoPlay className="h-full w-full object-cover" title={title}>
            <track kind="captions" />
          </video>
        ) : (
          <iframe
            src={`${src}${src.includes('?') ? '&' : '?'}autoplay=1`}
            title={title || 'Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        )
      ) : (
        <>
          <Image src={poster} alt={posterAlt} fill sizes="100vw" className="-z-10 object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-navy/30" />

          <button
            type="button"
            onClick={() => src && setPlaying(true)}
            disabled={!src}
            aria-label={title ? `Phát video: ${title}` : 'Phát video'}
            className="group absolute inset-0 flex items-center justify-center disabled:cursor-default"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-pill bg-accent text-white shadow-glow-accent transition-transform duration-300 ease-brand group-hover:scale-105 group-disabled:group-hover:scale-100 md:h-24 md:w-24">
              <svg className="ml-1 h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>

          {title && (
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <p className="font-display text-d5 uppercase leading-display tracking-display text-white">
                {title}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
