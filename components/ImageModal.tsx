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
    const floatingButtons = document.querySelector('[data-floating-contact]') as HTMLElement | null;
    const previousNavbarDisplay = navbar?.style.display ?? '';
    const previousFloatingDisplay = floatingButtons?.style.display ?? '';

    if (navbar) {
      navbar.style.display = 'none';
    }
    if (floatingButtons) {
      floatingButtons.style.display = 'none';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;

      if (navbar) {
        navbar.style.display = previousNavbarDisplay;
      }
      if (floatingButtons) {
        floatingButtons.style.display = previousFloatingDisplay;
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
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div
        className="flex flex-col items-center justify-center gap-2 sm:gap-3 relative w-full max-w-full sm:max-w-6xl"
        onClick={(e) => e.stopPropagation()}
      >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 z-[60] bg-white/90 hover:bg-white text-gray-800 p-1.5 sm:p-2 rounded-full transition-all duration-300 shadow-lg"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex justify-center w-full">
            <div className="relative flex items-center justify-center px-12 sm:px-14 md:px-16 w-full max-w-5xl">
              {hasMultipleImages && (
                <button
                  onClick={prevImage}
                  className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full transition-all duration-300 shadow-lg"
                  aria-label="Previous image"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              <div className="relative flex max-h-[60vh] sm:max-h-[70vh] items-center justify-center rounded-lg sm:rounded-2xl bg-black/40 p-2 sm:p-3 md:p-4 overflow-hidden w-full">
                {images[currentImageIndex] ? (
                  <Image
                    src={images[currentImageIndex]}
                    alt={`Product image ${currentImageIndex + 1}`}
                    width={1280}
                    height={720}
                    quality={100}
                    priority
                    sizes="(min-width: 1024px) 60vw, 90vw"
                    className="h-auto max-h-[55vh] sm:max-h-[65vh] w-auto max-w-full object-contain"
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

              {hasMultipleImages && (
                <button
                  onClick={nextImage}
                  className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full transition-all duration-300 shadow-lg"
                  aria-label="Next image"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {hasMultipleImages && (
            <>
              <div className="bg-black/60 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                {currentImageIndex + 1} / {images.length}
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 justify-center max-w-full px-4 sm:px-0 scrollbar-hide">
                {images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-white/10 hover:bg-white/20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
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
            </>
          )}
      </div>
    </div>
  );
}
