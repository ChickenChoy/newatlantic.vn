'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/types';
import { formatDescription } from '@/lib/textUtils';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const scrollPositionRef = useRef(0);
  const restoreTimeoutRef = useRef<number | null>(null);
  const hasScrolledToTopRef = useRef(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  
  const MAX_DESCRIPTION_LENGTH = 500; // Số ký tự tối đa trước khi tóm tắt

  // Reset expanded state when modal closes or product changes
  useEffect(() => {
    if (!isOpen) {
      setIsDescriptionExpanded(false);
    }
  }, [isOpen, product?.id]);

  // Close on ESC key and handle body scroll
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);

      // If there is a pending restore from a previous close, cancel it —
      // otherwise a delayed scroll restore can run after a reopen.
      if (restoreTimeoutRef.current) {
        clearTimeout(restoreTimeoutRef.current as unknown as number);
        restoreTimeoutRef.current = null;
      }

      // Only save scroll position if we haven't scrolled to top yet for this open
      // This prevents saving position 0 after we've already scrolled to top
      if (!hasScrolledToTopRef.current && window.scrollY > 0) {
        scrollPositionRef.current = window.scrollY;
      }

      // Jump to top immediately so the modal (which is fixed) is always visible.
      // Use 'auto' to make this deterministic (smooth sometimes gets ignored or interrupted).
      if (!hasScrolledToTopRef.current) {
        window.scrollTo({ top: 0, behavior: 'auto' });
        hasScrolledToTopRef.current = true;
      }

      // Prevent body scroll completely
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.documentElement.style.overflow = 'hidden';

      // Hide header when modal is open
      const header = document.querySelector('header');
      if (header) {
        header.style.opacity = '0';
        header.style.pointerEvents = 'none';
      }
      
      // Hide HeaderBottom when modal is open
      const headerBottom = document.querySelector('[data-header-bottom]');
      if (headerBottom) {
        (headerBottom as HTMLElement).style.opacity = '0';
        (headerBottom as HTMLElement).style.pointerEvents = 'none';
        (headerBottom as HTMLElement).style.transform = 'translateY(-100%)';
        (headerBottom as HTMLElement).style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      }
      
      // Hide FloatingContactButtons when modal is open
      const floatingContact = document.querySelector('[data-floating-contact="true"]');
      if (floatingContact) {
        (floatingContact as HTMLElement).style.opacity = '0';
        (floatingContact as HTMLElement).style.pointerEvents = 'none';
        (floatingContact as HTMLElement).style.transform = 'translateX(100%)';
        (floatingContact as HTMLElement).style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      }
    } else {
      // Reset the flag when modal closes
      hasScrolledToTopRef.current = false;
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.documentElement.style.overflow = '';

      // Show header when modal is closed
      const header = document.querySelector('header');
      if (header) {
        header.style.opacity = '1';
        header.style.pointerEvents = 'auto';
      }
      
      // Show HeaderBottom when modal is closed
      const headerBottom = document.querySelector('[data-header-bottom]');
      if (headerBottom) {
        (headerBottom as HTMLElement).style.opacity = '1';
        (headerBottom as HTMLElement).style.pointerEvents = 'auto';
        (headerBottom as HTMLElement).style.transform = 'translateY(0)';
        (headerBottom as HTMLElement).style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      }
      
      // Show FloatingContactButtons when modal is closed
      const floatingContact = document.querySelector('[data-floating-contact="true"]');
      if (floatingContact) {
        (floatingContact as HTMLElement).style.opacity = '';
        (floatingContact as HTMLElement).style.pointerEvents = '';
        (floatingContact as HTMLElement).style.transform = '';
        (floatingContact as HTMLElement).style.transition = '';
      }
    };
  }, [isOpen, onClose]);

  // Restore scroll position when modal closes (separate effect to avoid running during re-renders)
  useEffect(() => {
    // When the modal closes, restore the saved scroll position after a short
    // delay so the page layout has settled and body overflow has been restored.
    if (!isOpen && scrollPositionRef.current > 0) {
      restoreTimeoutRef.current = window.setTimeout(() => {
        window.scrollTo({ top: scrollPositionRef.current, behavior: 'smooth' });
        restoreTimeoutRef.current = null;
        // Don't clear scrollPositionRef here - it will be overwritten on next open
      }, 120);

      return () => {
        if (restoreTimeoutRef.current) {
          clearTimeout(restoreTimeoutRef.current as unknown as number);
          restoreTimeoutRef.current = null;
        }
      };
    }
    return;
  }, [isOpen]);

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] overflow-hidden bg-navy/70 backdrop-blur-sm"
          >
            {/* Modal Container - Centered */}
            <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-card border border-navy/14 bg-background shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label="Đóng"
                className="sticky top-4 right-4 z-10 ml-auto mb-4 mr-4 mt-4 flex h-10 w-10 items-center justify-center rounded-pill border border-navy/14 bg-background text-navy transition-colors duration-300 ease-brand hover:border-navy/30 hover:bg-surface"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="grid md:grid-cols-2 gap-8 lg:gap-12 p-6 md:p-8 lg:p-10 pt-0">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden rounded-card bg-surface">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      quality={95}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="h-24 w-24 text-navy/14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  {/* Featured Badge */}
                  {product.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="rounded-pill bg-accent px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-white">
                        Nổi bật
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex flex-col space-y-6">
                  {/* Category */}
                  <div>
                    <span className="inline-flex items-center rounded-pill border border-navy/14 bg-surface px-4 py-2 text-sm font-medium leading-none text-navy">
                      {product.categoryName || product.category}
                    </span>
                  </div>

                  {/* Product Name */}
                  <h2 className="font-display text-d4 uppercase leading-display tracking-display text-navy">
                    {product.name}
                  </h2>

                  {/* Description */}
                  {product.description && (
                    <div className="w-full">
                      {(() => {
                        // Clean and format text: remove HTML tags and WordPress shortcodes
                        const formatted = formatDescription(product.description);
                        
                        const isLong = formatted.length > MAX_DESCRIPTION_LENGTH;
                        const displayText = isLong && !isDescriptionExpanded 
                          ? formatted.substring(0, MAX_DESCRIPTION_LENGTH) + '...'
                          : formatted;
                        
                        return (
                          <>
                            <div
                              className="break-words text-base leading-[1.6] text-ink"
                              style={{
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                                wordBreak: 'break-word',
                                whiteSpace: 'pre-line'
                              }}
                            >
                              {displayText}
                            </div>
                            {isLong && (
                              <button
                                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-navy transition-colors duration-300 ease-brand hover:text-accent"
                              >
                                {isDescriptionExpanded ? (
                                  <>
                                    <span>Thu gọn</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                  </>
                                ) : (
                                  <>
                                    <span>Xem thêm</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </>
                                )}
                              </button>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}

                  {/* Specifications */}
                  {product.specifications && Object.keys(product.specifications).length > 0 && (
                    <div>
                      <h3 className="font-display mb-4 text-d6 uppercase leading-display tracking-display text-navy">
                        Thông số kỹ thuật
                      </h3>
                      <dl className="rounded-card border border-navy/14 bg-surface p-5">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex items-start justify-between gap-4 border-b border-navy/14 py-2.5 first:pt-0 last:border-0 last:pb-0"
                          >
                            <dt className="text-sm font-medium text-ink">{key}</dt>
                            <dd className="flex-1 text-right text-sm font-semibold text-navy">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-auto space-y-3 pt-4">
                    <Link
                      href={`/san-pham/${product.categorySlug}/${product.slug}`}
                      className="block w-full rounded-pill bg-accent px-6 py-3.5 text-center text-sm font-semibold uppercase tracking-[0.06em] text-white transition-colors duration-300 ease-brand hover:bg-accent-dark"
                    >
                      Xem chi tiết đầy đủ
                    </Link>
                    <Link
                      href="/lien-he"
                      className="block w-full rounded-pill border border-navy px-6 py-3.5 text-center text-sm font-semibold uppercase tracking-[0.06em] text-navy transition-colors duration-300 ease-brand hover:bg-navy hover:text-white"
                    >
                      Liên hệ tư vấn
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
