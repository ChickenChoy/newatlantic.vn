'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface RelatedPostsSliderProps {
  relatedPosts: any[];
}

export default function RelatedPostsSlider({ relatedPosts }: RelatedPostsSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  // Navigation functions
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -272, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 272, behavior: 'smooth' });
    }
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setIsUserInteracting(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      scrollRight();
    } else if (isRightSwipe) {
      scrollLeft();
    }

    // Resume auto-scroll after 3 seconds
    setTimeout(() => {
      setIsUserInteracting(false);
    }, 3000);
  };

  // Auto-scroll for related posts slider
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || relatedPosts.length <= 3) return;

    let scrollInterval: NodeJS.Timeout;

    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (!isUserInteracting && slider) {
          const maxScroll = slider.scrollWidth - slider.clientWidth;
          const currentScroll = slider.scrollLeft;
          
          if (currentScroll >= maxScroll - 10) {
            // Reset to start
            slider.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            // Scroll by card width (w-64 = 256px + gap 16px)
            slider.scrollBy({ left: 272, behavior: 'smooth' });
          }
        }
      }, 3000); // Auto-scroll every 3 seconds
    };

    const handleUserInteraction = () => {
      setIsUserInteracting(true);
      clearInterval(scrollInterval);
      
      // Resume auto-scroll after 5 seconds of no interaction
      setTimeout(() => {
        setIsUserInteracting(false);
        startAutoScroll();
      }, 5000);
    };

    slider.addEventListener('mouseenter', handleUserInteraction);
    slider.addEventListener('touchstart', handleUserInteraction);

    startAutoScroll();

    return () => {
      clearInterval(scrollInterval);
      if (slider) {
        slider.removeEventListener('mouseenter', handleUserInteraction);
        slider.removeEventListener('touchstart', handleUserInteraction);
      }
    };
  }, [relatedPosts.length]);

  return (
    <div>
      {/* Header — display heading left, circular controls right */}
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-navy/14 pb-6">
        <h2 className="font-display text-d4 uppercase leading-display tracking-display text-navy">
          Bài viết liên quan
        </h2>

        {relatedPosts.length > 3 && (
          <div className="flex items-center gap-3">
            <button
              onClick={scrollLeft}
              className="flex h-10 w-10 items-center justify-center rounded-pill border border-navy/14 bg-background text-navy transition-colors duration-300 ease-brand hover:border-accent hover:bg-accent hover:text-white"
              aria-label="Xem bài trước"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={scrollRight}
              className="flex h-10 w-10 items-center justify-center rounded-pill border border-navy/14 bg-background text-navy transition-colors duration-300 ease-brand hover:border-accent hover:bg-accent hover:text-white"
              aria-label="Xem bài tiếp theo"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Slider Track */}
      <div
        ref={sliderRef}
        className="scrollbar-hide overflow-x-auto"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex gap-6 pb-2">
          {relatedPosts.map((relatedPost) => {
            const relatedFormattedDate = new Date(relatedPost.date).toLocaleDateString('vi-VN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });
            return (
              <Link
                key={relatedPost.id}
                href={`/tin-tuc/${relatedPost.slug}`}
                className="group w-64 shrink-0 overflow-hidden rounded-card border border-navy/14 bg-background transition-colors duration-300 ease-brand hover:border-navy"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
                  {relatedPost.image ? (
                    <Image
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      fill
                      sizes="256px"
                      className="object-cover transition-transform duration-700 ease-brand group-hover:scale-[1.06]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-navy/14">
                      <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <span className="text-xs uppercase tracking-[0.14em] text-muted">
                    {relatedFormattedDate}
                  </span>

                  <h3 className="mt-3 line-clamp-2 font-display text-lg uppercase leading-tight tracking-display text-navy transition-colors duration-300 ease-brand group-hover:text-accent">
                    {relatedPost.title}
                  </h3>

                  {relatedPost.excerpt && (
                    <p className="mt-3 line-clamp-2 text-sm leading-[1.6] text-ink">
                      {relatedPost.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Scroll hint */}
      {relatedPosts.length > 3 && (
        <p className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
          <svg className="h-4 w-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          Vuốt sang để xem thêm
        </p>
      )}
    </div>
  );
}

