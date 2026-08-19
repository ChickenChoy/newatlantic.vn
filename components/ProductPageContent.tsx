'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import TouchGestureWrapper from './TouchGestureWrapper';
import GalleryLightbox from './GalleryLightbox';
import LiveVisitorCount from './LiveVisitorCount';
import StickyCTABar from './StickyCTABar';
import Reveal from './motion/Reveal';
import { ArrowButton, CTABand, Eyebrow, Section, SectionHeader } from './sections';
import { WishlistManager } from '@/lib/wishlist';
import { cleanText, sanitizeHtmlContent } from '@/lib/textUtils';
import { trackProductView, trackAddToWishlist } from '@/lib/analytics';
import { showToast } from '@/lib/toast-utils';
import type { Product } from '@/types';

interface ProductPageContentProps {
  product: Product;
  relatedProducts: Product[];
}

/** Shared by both rich-text blocks: the template's light editorial typography. */
const PROSE_CLASS = `prose max-w-none prose-sm sm:prose-base
  prose-headings:font-display prose-headings:uppercase prose-headings:tracking-display prose-headings:text-navy
  prose-p:text-ink prose-p:leading-[1.6]
  prose-strong:text-navy prose-strong:font-semibold
  prose-ul:text-ink prose-ol:text-ink prose-li:text-ink
  prose-a:text-accent prose-a:no-underline hover:prose-a:underline`;

const GUARANTEES = [
  {
    title: 'Chất lượng cao, độ bền vượt trội',
    detail: 'Đạt tiêu chuẩn quốc tế ISO 9001',
  },
  {
    title: 'Bảo hành chính hãng',
    detail: 'Chế độ bảo hành toàn diện từ nhà sản xuất',
  },
  {
    title: 'Hỗ trợ kỹ thuật 24/7',
    detail: 'Đội ngũ kỹ sư chuyên nghiệp sẵn sàng hỗ trợ',
  },
];

export default function ProductPageContent({ product, relatedProducts }: ProductPageContentProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const images = product.images?.length ? product.images : [product.image];

  // Check if product is in wishlist
  useEffect(() => {
    setIsInWishlist(WishlistManager.isInWishlist(product.id));
  }, [product.id]);

  // Track product view on mount
  useEffect(() => {
    trackProductView({
      id: product.id,
      name: product.name,
      category: product.categoryName || product.category,
      price: product.price,
    });
  }, [product.id, product.name, product.category, product.categoryName, product.price]);

  const toggleWishlist = () => {
    if (isInWishlist) {
      WishlistManager.removeFromWishlist(product.id);
      setIsInWishlist(false);
      showToast.info('Đã xóa khỏi yêu thích');
    } else {
      WishlistManager.addToWishlist(product);
      setIsInWishlist(true);
      showToast.success(`Đã thêm "${product.name}" vào yêu thích`);

      // Track analytics
      trackAddToWishlist({
        id: product.id,
        name: product.name,
        category: product.categoryName || product.category,
      });
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Navigation functions for related products slider
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

  // Auto-scroll for related products slider
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || relatedProducts.length <= 3) return;

    let scrollInterval: NodeJS.Timeout | null = null;
    let resumeTimeout: NodeJS.Timeout | null = null;
    let isUserInteracting = false;

    const startAutoScroll = () => {
      // Clear any existing interval before starting a new one
      if (scrollInterval) {
        clearInterval(scrollInterval);
      }

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
      isUserInteracting = true;

      // Clear existing interval
      if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
      }

      // Clear any pending resume timeout
      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
      }

      // Resume auto-scroll after 5 seconds of no interaction
      resumeTimeout = setTimeout(() => {
        isUserInteracting = false;
        startAutoScroll();
      }, 5000);
    };

    slider.addEventListener('mouseenter', handleUserInteraction);
    slider.addEventListener('touchstart', handleUserInteraction);

    startAutoScroll();

    return () => {
      // Cleanup: clear all intervals and timeouts
      if (scrollInterval) {
        clearInterval(scrollInterval);
      }
      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
      }
      if (slider) {
        slider.removeEventListener('mouseenter', handleUserInteraction);
        slider.removeEventListener('touchstart', handleUserInteraction);
      }
    };
  }, [relatedProducts.length]);

  return (
    <>
      {/* Product head — light band, top padding clears the fixed nav */}
      <div className="bg-background pb-16 pt-[104px] md:pt-[152px]">
        <div className="mx-auto w-full max-w-site px-5 md:px-gutter">
          {/* Breadcrumbs */}
          <nav aria-label="Đường dẫn" className="mb-10">
            <ol className="flex flex-wrap items-center gap-2 text-sm">
              <li>
                <Link href="/" className="text-muted transition-colors duration-300 ease-brand hover:text-accent">
                  Trang chủ
                </Link>
              </li>
              <li aria-hidden="true" className="text-navy/30">/</li>
              <li>
                <Link href="/san-pham" className="text-muted transition-colors duration-300 ease-brand hover:text-accent">
                  Sản phẩm
                </Link>
              </li>
              {product.categorySlug && (
                <>
                  <li aria-hidden="true" className="text-navy/30">/</li>
                  <li>
                    <Link
                      href={`/san-pham/${product.categorySlug}`}
                      className="text-muted transition-colors duration-300 ease-brand hover:text-accent"
                    >
                      {product.categoryName || product.category}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden="true" className="text-navy/30">/</li>
              <li className="text-navy" aria-current="page">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Gallery */}
            <div>
              <TouchGestureWrapper
                onSwipeLeft={nextImage}
                onSwipeRight={prevImage}
                className="relative h-[300px] overflow-hidden rounded-card border border-navy/14 bg-surface sm:h-[380px] lg:h-[520px]"
              >
                <div className="relative h-full w-full">
                  {images[currentImageIndex] ? (
                    <button
                      onClick={openModal}
                      className="flex h-full w-full cursor-zoom-in items-center justify-center"
                      aria-label="Xem ảnh phóng to"
                    >
                      <Image
                        src={images[currentImageIndex]}
                        alt={product.name}
                        fill
                        className="object-contain p-6 md:p-10"
                        quality={95}
                        priority={true}
                      />
                    </button>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-navy/14">
                      <svg className="h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  {/* Wishlist */}
                  <button
                    onClick={toggleWishlist}
                    aria-pressed={isInWishlist}
                    className={`absolute left-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-pill border transition-all duration-300 ease-brand ${
                      isInWishlist
                        ? 'border-accent bg-accent text-white'
                        : 'border-navy/14 bg-background text-navy hover:border-accent hover:text-accent'
                    }`}
                    title={isInWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                    aria-label={isInWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                  >
                    <svg className="h-5 w-5" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>

                  {/* Featured badge */}
                  {product.featured && (
                    <span className="absolute right-4 top-4 z-10 rounded-pill bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                      Nổi bật
                    </span>
                  )}

                  {/* Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-pill border border-navy/14 bg-background text-navy transition-all duration-300 ease-brand hover:bg-navy hover:text-white"
                        aria-label="Ảnh trước"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-pill border border-navy/14 bg-background text-navy transition-all duration-300 ease-brand hover:bg-navy hover:text-white"
                        aria-label="Ảnh sau"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      <span className="absolute bottom-4 right-4 rounded-pill bg-navy px-3 py-1.5 text-xs font-medium text-white">
                        {String(currentImageIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                      </span>
                    </>
                  )}
                </div>
              </TouchGestureWrapper>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-card border-2 bg-surface transition-all duration-300 ease-brand ${
                        index === currentImageIndex
                          ? 'border-accent'
                          : 'border-navy/14 opacity-60 hover:opacity-100'
                      }`}
                      aria-label={`Xem ảnh ${index + 1}`}
                      aria-current={index === currentImageIndex}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} - Ảnh ${index + 1}`}
                        fill
                        sizes="64px"
                        className="object-contain p-1.5"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Image Lightbox */}
            <GalleryLightbox
              images={images.map((img, idx) => ({
                src: img,
                alt: `${product.name} - Ảnh ${idx + 1}`,
                title: product.name,
                description: product.shortDescription,
                category: product.category
              }))}
              currentIndex={currentImageIndex}
              isOpen={isModalOpen}
              onClose={closeModal}
            />

            {/* Product info */}
            <div className="flex flex-col">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <Eyebrow>{product.categoryName || product.category}</Eyebrow>
                <LiveVisitorCount productId={product.id} />
              </div>

              <h1 className="font-display text-d4 uppercase leading-display tracking-display text-navy">
                {product.name}
              </h1>

              {product.shortDescription && (
                <p className="mt-6 text-base leading-[1.6] text-ink md:text-lg">
                  {cleanText(product.shortDescription)}
                </p>
              )}

              {/* Price */}
              <div className="mt-8 rounded-card bg-navy p-8">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
                  Giá sản phẩm
                </p>
                <p className="font-display mt-3 text-d5 uppercase leading-display tracking-display text-white">
                  {product.price}
                </p>
                <p className="mt-3 text-sm text-white/60">
                  Liên hệ ngay để nhận báo giá tốt nhất cho dự án của bạn.
                </p>
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <ArrowButton href="tel:+842838733686" variant="accent" external>
                  +84 2838 733 686
                </ArrowButton>
                <ArrowButton href="/lien-he" variant="outline">
                  Yêu cầu báo giá
                </ArrowButton>
              </div>

              {/* Guarantees */}
              <div className="mt-10 border-t border-navy/14 pt-8">
                <h2 className="font-display text-d6 uppercase leading-display tracking-display text-navy">
                  Cam kết chất lượng
                </h2>

                <ul className="mt-6 flex flex-col gap-5">
                  {GUARANTEES.map(item => (
                    <li key={item.title} className="flex items-start gap-4">
                      <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-pill bg-accent text-white">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>
                        <span className="block text-base font-semibold text-navy">{item.title}</span>
                        <span className="mt-1 block text-sm text-muted">{item.detail}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview */}
      {(product.description || product.shortDescription) && (
        <Section tone="surface">
          <SectionHeader
            eyebrow="Tổng quan"
            title="Tổng quan sản phẩm"
            layout="center"
            size="d4"
            className="mb-14"
          />
          <Reveal className="mx-auto max-w-4xl">
            <div
              className={PROSE_CLASS}
              dangerouslySetInnerHTML={{
                __html: sanitizeHtmlContent(product.description || product.shortDescription || '')
              }}
            />
          </Reveal>
        </Section>
      )}

      {/* Specifications & detail */}
      {product.fullDescription && (
        <Section>
          <SectionHeader
            eyebrow="Chi tiết kỹ thuật"
            title="Thông số & mô tả chi tiết"
            layout="center"
            size="d4"
            className="mb-14"
          />

          {/* Tables in CMS content can be wider than the column on small screens */}
          <div className="overflow-x-auto lg:overflow-x-visible [&_table]:min-w-[600px] lg:[&_table]:min-w-0 lg:[&_table]:w-full lg:[&_table]:!h-auto lg:[&_tr]:!h-auto lg:[&_td]:!h-auto">
            <div
              className={`${PROSE_CLASS} lg:prose-lg
                prose-headings:text-center prose-headings:mb-6 prose-headings:mt-10
                prose-p:mb-6 prose-ul:mb-6 prose-ol:mb-6
                prose-table:w-full prose-table:border-collapse prose-table:my-8 prose-table:overflow-hidden prose-table:rounded-card
                prose-thead:bg-navy
                prose-th:bg-navy prose-th:p-4 prose-th:text-left prose-th:font-semibold prose-th:text-white prose-th:whitespace-nowrap lg:prose-th:whitespace-normal
                prose-td:border prose-td:border-navy/14 prose-td:p-4 prose-td:text-ink prose-td:leading-[1.6]
                prose-tr:even:bg-surface
                lg:[&_*]:whitespace-normal lg:[&_*]:break-words
                [&_.wp-block-table]:overflow-x-auto lg:[&_.wp-block-table]:overflow-visible
                [&_p]:!whitespace-normal [&_p]:break-words`}
              dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(product.fullDescription) }}
            />
          </div>
        </Section>
      )}

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <Section tone="surface">
          <SectionHeader
            eyebrow="Cùng danh mục"
            title="Sản phẩm liên quan"
            action={
              product.categorySlug ? (
                <ArrowButton href={`/san-pham/${product.categorySlug}`} variant="navy">
                  Xem danh mục
                </ArrowButton>
              ) : undefined
            }
            className="mb-14"
          />

          <TouchGestureWrapper
            onSwipeLeft={scrollRight}
            onSwipeRight={scrollLeft}
            className="group relative"
          >
            {relatedProducts.length > 2 && (
              <>
                <button
                  onClick={scrollLeft}
                  className="absolute left-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-pill border border-navy/14 bg-background text-navy opacity-0 transition-all duration-300 ease-brand hover:bg-navy hover:text-white focus-visible:opacity-100 group-hover:opacity-100"
                  aria-label="Cuộn sang trái"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={scrollRight}
                  className="absolute right-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-pill border border-navy/14 bg-background text-navy opacity-0 transition-all duration-300 ease-brand hover:bg-navy hover:text-white focus-visible:opacity-100 group-hover:opacity-100"
                  aria-label="Cuộn sang phải"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Slider track */}
            <div ref={sliderRef} className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-6 pb-4">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    href={`/san-pham/${relatedProduct.categorySlug}/${relatedProduct.slug}`}
                    className="group/card flex w-56 flex-shrink-0 flex-col overflow-hidden rounded-card border border-navy/14 bg-background transition-colors duration-300 ease-brand hover:border-navy/30 lg:w-64"
                  >
                    <div className="relative h-44 w-full shrink-0 overflow-hidden bg-surface">
                      {relatedProduct.image ? (
                        <Image
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          fill
                          sizes="256px"
                          className="object-contain p-4 transition-transform duration-[400ms] ease-brand group-hover/card:scale-105"
                          quality={85}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-navy/14">
                          <svg className="h-14 w-14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}

                      {relatedProduct.featured && (
                        <span className="absolute right-3 top-3 rounded-pill bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                          Nổi bật
                        </span>
                      )}
                    </div>

                    <div className="flex flex-grow flex-col p-5">
                      <h3 className="font-display line-clamp-2 text-base uppercase leading-tight tracking-display text-navy transition-colors duration-300 ease-brand group-hover/card:text-accent">
                        {relatedProduct.name}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-[1.6] text-muted">
                        {relatedProduct.description ? cleanText(relatedProduct.description) : ''}
                      </p>
                      <p className="mt-auto pt-4 text-sm font-semibold text-accent">
                        {relatedProduct.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Vuốt sang để xem thêm
            </p>
          </TouchGestureWrapper>
        </Section>
      )}

      <CTABand
        eyebrow="Yêu cầu báo giá"
        title="Cần thông số chi tiết hơn?"
        intro={`Gửi yêu cầu về ${product.name} — kỹ sư của NEW ATLANTIC sẽ gửi catalog kỹ thuật và báo giá trong ngày làm việc.`}
        actions={
          <>
            <ArrowButton href="/lien-he" variant="accent">
              Liên hệ tư vấn
            </ArrowButton>
            <ArrowButton href="tel:+842838733686" variant="outline-light" external>
              Gọi ngay
            </ArrowButton>
          </>
        }
      />

      {/* Sticky CTA Bar for Mobile */}
      <StickyCTABar productName={product.name} />
    </>
  );
}
