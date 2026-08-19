'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useToast } from '@/components/ToastProvider';

interface GalleryImage {
  src: string;
  alt: string;
  title?: string;
  description?: string;
  category?: string;
}

interface GalleryLightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (index: number) => void;
}

export default function GalleryLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  const toast = useToast();
  const [imageIndex, setImageIndex] = useState(currentIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const savedScrollYRef = useRef<number>(0);

  const currentImage = images[imageIndex];

  // Update index when prop changes
  useEffect(() => {
    setImageIndex(currentIndex);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevImage();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextImage();
          break;
        case '+':
        case '=':
          e.preventDefault();
          handleZoomIn();
          break;
        case '-':
          e.preventDefault();
          handleZoomOut();
          break;
        case '0':
          e.preventDefault();
          resetZoom();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, imageIndex]);

  // Scroll to top immediately when opening modal
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position BEFORE scrolling
      savedScrollYRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

      // Force scroll to top immediately using multiple methods
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // Use requestAnimationFrame to ensure scroll happens before render
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;

      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${savedScrollYRef.current}px`;
      document.body.style.width = '100%';

      // Also prevent html scroll
      document.documentElement.style.overflow = 'hidden';

      const header = document.querySelector('header');
      const floatingContact = document.querySelector('[data-floating-contact="true"]');
      if (header) header.style.display = 'none';
      if (floatingContact) (floatingContact as HTMLElement).style.display = 'none';

      return () => {
        // Restore scroll position on cleanup
        const scrollY = savedScrollYRef.current;

        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = originalWidth;
        document.documentElement.style.overflow = '';

        // Restore scroll position
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollY);
          document.documentElement.scrollTop = scrollY;
          document.body.scrollTop = scrollY;
        });

        const header = document.querySelector('header');
        const floatingContact = document.querySelector('[data-floating-contact="true"]');
        if (header) header.style.display = '';
        if (floatingContact) (floatingContact as HTMLElement).style.display = '';
      };
    }
  }, [isOpen]);

  const nextImage = () => {
    const next = (imageIndex + 1) % images.length;
    setImageIndex(next);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    onNavigate?.(next);
  };

  const prevImage = () => {
    const prev = (imageIndex - 1 + images.length) % images.length;
    setImageIndex(prev);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    onNavigate?.(prev);
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      if (e.deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    }
  };

  const downloadImage = async () => {
    try {
      const response = await fetch(currentImage.src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = currentImage.src.split('/').pop() || 'image';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const shareImage = async () => {
    if (navigator.share) {
      try {
        const response = await fetch(currentImage.src);
        const blob = await response.blob();
        const file = new File([blob], 'image.jpg', { type: blob.type });
        await navigator.share({
          title: currentImage.title || currentImage.alt,
          text: currentImage.description || '',
          files: [file],
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Đã sao chép link vào clipboard!');
    }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !currentImage || !mounted || typeof window === 'undefined') return null;

  const modalContent = (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-navy/95 z-[9999] flex items-center justify-center"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && scale === 1) {
          onClose();
        }
      }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-pill border border-white/14 bg-white/10 text-white transition-all duration-300 ease-brand hover:scale-105 hover:bg-accent"
        aria-label="Đóng"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-pill border border-white/14 bg-white/10 text-white transition-all duration-300 ease-brand hover:scale-105 hover:bg-accent"
            aria-label="Ảnh trước"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-pill border border-white/14 bg-white/10 text-white transition-all duration-300 ease-brand hover:scale-105 hover:bg-accent"
            aria-label="Ảnh sau"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Image Container */}
      <div
        ref={imageRef}
        className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={currentImage.src}
          alt={currentImage.alt}
          width={1920}
          height={1080}
          className="max-w-full max-h-[90vh] object-contain"
          priority
          quality={100}
        />
      </div>

      {/* Controls Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy to-transparent p-6 z-50">
        <div className="mx-auto max-w-site">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomOut}
                className="flex h-10 w-10 items-center justify-center rounded-pill border border-white/14 bg-white/10 text-white transition-colors duration-300 ease-brand hover:bg-accent"
                aria-label="Thu nhỏ"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="min-w-[60px] text-center text-sm text-white">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="flex h-10 w-10 items-center justify-center rounded-pill border border-white/14 bg-white/10 text-white transition-colors duration-300 ease-brand hover:bg-accent"
                aria-label="Phóng to"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button
                onClick={resetZoom}
                className="rounded-pill border border-white/14 bg-white/10 px-4 py-2 text-sm text-white transition-colors duration-300 ease-brand hover:bg-accent"
              >
                Đặt lại
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={downloadImage}
                className="flex h-10 w-10 items-center justify-center rounded-pill border border-white/14 bg-white/10 text-white transition-colors duration-300 ease-brand hover:bg-accent"
                aria-label="Tải ảnh xuống"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <button
                onClick={shareImage}
                className="flex h-10 w-10 items-center justify-center rounded-pill border border-white/14 bg-white/10 text-white transition-colors duration-300 ease-brand hover:bg-accent"
                aria-label="Chia sẻ ảnh"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342A3 3 0 106.316 10.658m2.368 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684zm0-12.684a3 3 0 105.368-2.684 3 3 0 00-5.368 2.684z" />
                </svg>
              </button>
              <button
                onClick={toggleFullscreen}
                className="flex h-10 w-10 items-center justify-center rounded-pill border border-white/14 bg-white/10 text-white transition-colors duration-300 ease-brand hover:bg-accent"
                aria-label="Toàn màn hình"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="text-sm text-white/60">
                {String(imageIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-24 left-0 right-0 z-40 overflow-x-auto pb-2">
          <div className="flex gap-2 justify-center px-4">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => {
                  setImageIndex(index);
                  setScale(1);
                  setPosition({ x: 0, y: 0 });
                  onNavigate?.(index);
                }}
                className={`relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-card border-2 transition-all duration-300 ease-brand ${index === imageIndex
                    ? 'border-accent scale-110'
                    : 'border-transparent opacity-60 hover:border-white/60 hover:opacity-100'
                  }`}
                aria-label={`Xem ảnh ${index + 1}`}
                aria-current={index === imageIndex}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Use Portal to render modal at document.body level
  return createPortal(modalContent, document.body);
}

