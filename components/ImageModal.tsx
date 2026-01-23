'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageModalProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageModal({ images, currentIndex, isOpen, onClose }: ImageModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(currentIndex);
  const hasMultipleImages = images.length > 1;

  // Update current index when prop changes
  useEffect(() => {
    setCurrentImageIndex(currentIndex);
  }, [currentIndex]);

  // Close modal on escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const navbar = document.querySelector('header') as HTMLElement | null;
    const headerBottom = document.querySelector('[data-header-bottom]') as HTMLElement | null;
    const floatingButtons = document.querySelector('[data-floating-contact]') as HTMLElement | null;
    const stickyCTA = document.querySelector('[data-sticky-cta]') as HTMLElement | null;
    const previousNavbarDisplay = navbar?.style.display ?? '';
    const previousHeaderBottomDisplay = headerBottom?.style.display ?? '';
    const previousFloatingDisplay = floatingButtons?.style.display ?? '';
    const previousStickyCTADisplay = stickyCTA?.style.display ?? '';

    if (navbar) {
      navbar.style.display = 'none';
    }
    if (headerBottom) {
      headerBottom.style.display = 'none';
    }
    if (floatingButtons) {
      floatingButtons.style.display = 'none';
    }
    if (stickyCTA) {
      stickyCTA.style.display = 'none';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;

      if (navbar) {
        navbar.style.display = previousNavbarDisplay;
      }
      if (headerBottom) {
        headerBottom.style.display = previousHeaderBottomDisplay;
      }
      if (floatingButtons) {
        floatingButtons.style.display = previousFloatingDisplay;
      }
      if (stickyCTA) {
        stickyCTA.style.display = previousStickyCTADisplay;
      }
    };
  }, [isOpen, onClose]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[110] bg-white/90 hover:bg-white text-gray-800 p-2.5 sm:p-3 rounded-full transition-all duration-300 shadow-xl hover:scale-110"
        aria-label="Close modal"
      >
        <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Navigation buttons */}
      {hasMultipleImages && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-[110] bg-white/90 hover:bg-white text-gray-800 p-2.5 sm:p-3 lg:p-4 rounded-full transition-all duration-300 shadow-lg hover:scale-110"
            aria-label="Previous image"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-[110] bg-white/90 hover:bg-white text-gray-800 p-2.5 sm:p-3 lg:p-4 rounded-full transition-all duration-300 shadow-lg hover:scale-110"
            aria-label="Next image"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Full screen image */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        {images[currentImageIndex] ? (
          <img
            src={images[currentImageIndex]}
            alt={`Product image ${currentImageIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-white/60">
            <svg className="w-24 h-24 sm:w-32 sm:h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-sm">Image not available</p>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {hasMultipleImages && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[110] flex flex-col items-center gap-3">
          <div className="bg-black/60 text-white px-3 py-1.5 rounded-full text-sm font-medium">
            {currentImageIndex + 1} / {images.length}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 justify-center max-w-[90vw]">
            {images.map((image: string, index: number) => (
              <button
                key={index}
                onClick={(e) => { e.stopPropagation(); goToImage(index); }}
                className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/10 hover:bg-white/20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  index === currentImageIndex ? 'border-white' : 'border-transparent'
                }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
