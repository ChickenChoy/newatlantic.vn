'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { generateBreadcrumbSchema } from '@/lib/seo';
import GalleryLightbox from '@/components/GalleryLightbox';
import HolidayBanner from '@/components/HolidayBanner';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import EmptyState from '@/components/EmptyState';
import { PageHero, Section, CTABand, ArrowButton } from '@/components/sections';
import StaggerGroup from '@/components/motion/StaggerGroup';
import { GalleryImage as GalleryImageType } from '@/types';

interface GalleryImage {
  src: string;
  alt: string;
}

const GRID_CLASS = 'grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-4';

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

      <PageHero
        eyebrow="Thư viện hình ảnh"
        title="Hình ảnh dự án"
        image="/images/place-holder/excavator-construction.jpg"
        intro="Hình ảnh thực tế về thiết bị, công trình và hoạt động triển khai của New Atlantic — Tân Đại Tây Dương."
        breadcrumbs={[{ name: 'Trang chủ', href: '/' }, { name: 'Thư viện hình ảnh' }]}
      />

      {/* Holiday banner — collapses on days with no active holiday effect */}
      <div className="mx-auto flex w-full max-w-site justify-center px-5 py-12 md:px-gutter empty:hidden">
        <HolidayBanner variant="minimal" />
      </div>

      <Section>
        {isLoading ? (
          <div className={GRID_CLASS}>
            {[...Array(8)].map((_, i) => (
              <SkeletonLoader key={i} className="aspect-square rounded-card" />
            ))}
          </div>
        ) : galleryImages.length === 0 ? (
          <EmptyState
            title="Chưa có hình ảnh"
            description="Thư viện đang được cập nhật. Trong lúc chờ, bạn có thể xem danh mục thiết bị của chúng tôi."
            actionLabel="Xem sản phẩm"
            actionHref="/san-pham"
          />
        ) : (
          <StaggerGroup className={GRID_CLASS} stagger={60}>
            {galleryImages.map((image, index) => (
              <button
                key={`${image.src}-${index}`}
                type="button"
                onClick={() => openLightbox(index)}
                aria-label={`Xem ảnh: ${image.alt}`}
                className="group relative block w-full overflow-hidden rounded-card border border-navy/14 bg-surface"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-700 ease-brand group-hover:scale-[1.06]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    loading="lazy"
                  />
                  {/* Navy scrim + zoom affordance, revealed on hover */}
                  <div className="absolute inset-0 bg-navy/50 opacity-0 transition-opacity duration-300 ease-brand group-hover:opacity-100" />
                  <span
                    aria-hidden="true"
                    className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-pill bg-accent text-white opacity-0 transition-all duration-300 ease-brand group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                      />
                    </svg>
                  </span>
                </div>
              </button>
            ))}
          </StaggerGroup>
        )}
      </Section>

      <CTABand
        eyebrow="Muốn xem thiết bị tận nơi?"
        title="Đặt lịch tham quan xưởng"
        intro="Chúng tôi sắp xếp buổi tham quan xưởng sản xuất và demo thiết bị theo lịch của bạn."
        actions={
          <>
            <ArrowButton href="/lien-he" variant="accent">
              Liên hệ ngay
            </ArrowButton>
            <ArrowButton href="/san-pham" variant="outline-light">
              Xem sản phẩm
            </ArrowButton>
          </>
        }
      />

      {/* Lightbox */}
      {selectedImageIndex !== null && (
        <GalleryLightbox
          images={galleryImages}
          currentIndex={selectedImageIndex}
          isOpen={true}
          onClose={closeLightbox}
        />
      )}
    </>
  );
}
