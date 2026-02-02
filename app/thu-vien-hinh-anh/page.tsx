'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { generateBreadcrumbSchema } from '@/lib/seo';
import GalleryLightbox from '@/components/GalleryLightbox';
import HolidayBanner from '@/components/HolidayBanner';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { GalleryImage as GalleryImageType } from '@/types';

interface GalleryImage {
  src: string;
  alt: string;
}

export default function GalleryPage() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  // Load gallery images from API
  const loadGalleryImages = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/gallery');
      if (res.ok) {
        const data: GalleryImageType[] = await res.json();
        // Transform API data to match expected format
        const images: GalleryImage[] = data
          .sort((a, b) => a.order - b.order)
          .map(img => ({
            src: img.src,
            alt: img.alt,
          }));
        setGalleryImages(images);
      }
    } catch (error) {
      console.error('Error loading gallery images:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load images on mount and update page title
  useEffect(() => {
    document.title = 'Thư viện hình ảnh | NEW ATLANTIC - Tân Đại Tây Dương';
    loadGalleryImages();
  }, [loadGalleryImages]);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Trang chủ', url: '/' },
    { name: 'Thư viện hình ảnh', url: '/thu-vien-hinh-anh' },
  ]);

  const openLightbox = (index: number) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    requestAnimationFrame(() => {
      setSelectedImageIndex(index);
    });
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <div className="bg-[#050c3a] min-h-screen pt-24 sm:pt-28 md:pt-32 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-purple-500/20 rounded-full blur-[80px] sm:blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-violet-500/20 rounded-full blur-[80px] sm:blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        </div>

        {/* Header Section */}
        <div className="relative z-10 border-b border-white/10">
          <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4 sm:mb-6">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                Thư viện hình ảnh
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
                Thư viện <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">Hình ảnh</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto mb-6">
                Khám phá bộ sưu tập hình ảnh về các dự án, sản phẩm và hoạt động của New Atlantic.
              </p>

              {/* Holiday Banner - Centered Minimal */}
              <div className="flex justify-center">
                <HolidayBanner variant="minimal" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 relative z-10">
          {/* Content Area */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <SkeletonLoader key={i} className="aspect-square rounded-xl sm:rounded-2xl" />
              ))}
            </div>
          ) : galleryImages.length === 0 ? (
            <div className="text-center py-16 sm:py-20 md:py-24 bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-white/10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">Chưa có hình ảnh</h3>
              <p className="text-sm sm:text-base text-gray-400">Hình ảnh sẽ được cập nhật sớm</p>
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="group relative bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-white/10"
                  onClick={() => openLightbox(index)}
                >
                  <div className="relative aspect-square bg-gray-900/50 overflow-hidden">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lightbox */}
        {selectedImageIndex !== null && (
          <GalleryLightbox
            images={galleryImages}
            currentIndex={selectedImageIndex}
            isOpen={true}
            onClose={closeLightbox}
          />
        )}
      </div>
    </>
  );
}
