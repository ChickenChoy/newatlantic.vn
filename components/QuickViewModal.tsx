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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] overflow-hidden"
          >
            {/* Modal Container - Centered */}
            <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full relative max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="sticky top-4 right-4 z-10 w-10 h-10 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 ml-auto mb-4 mr-4 mt-4"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="grid md:grid-cols-2 gap-8 lg:gap-12 p-6 md:p-8 lg:p-10 pt-0">
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden">
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
                      <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Featured Badge */}
                  {product.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-md">
                        Nổi bật
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex flex-col space-y-6">
                  {/* Category */}
                  <div>
                    <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium">
                      {product.categoryName || product.category}
                    </span>
                  </div>

                  {/* Product Name */}
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                    {product.name}
                  </h2>

                  {/* Description */}
                  {product.description && (
                    <div className="w-full">
                      {(() => {
                        // Clean and format text: remove HTML tags and WordPress shortcodes
                        let formatted = formatDescription(product.description);
                        
                        const isLong = formatted.length > MAX_DESCRIPTION_LENGTH;
                        const displayText = isLong && !isDescriptionExpanded 
                          ? formatted.substring(0, MAX_DESCRIPTION_LENGTH) + '...'
                          : formatted;
                        
                        return (
                          <>
                            <div 
                              className="text-gray-600 leading-relaxed text-base md:text-lg break-words"
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
                                className="mt-3 text-[#5f7ab8] hover:text-[#4a6199] font-medium text-sm transition-colors duration-200 inline-flex items-center gap-1"
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
                      <h3 className="font-semibold text-gray-900 mb-4 text-lg">Thông số kỹ thuật:</h3>
                      <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-start py-2 border-b border-gray-200 last:border-0">
                            <span className="text-sm md:text-base text-gray-600 font-medium pr-4">{key}:</span>
                            <span className="text-sm md:text-base font-medium text-gray-900 text-right flex-1">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-auto pt-4 space-y-3">
                    <Link
                      href={`/san-pham/${product.categorySlug}/${product.slug}`}
                      className="block w-full bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white py-3 px-6 rounded-xl font-semibold text-center hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      Xem chi tiết đầy đủ
                    </Link>
                    <Link
                      href="/lien-he"
                      className="block w-full border-2 border-[#5f7ab8] text-[#5f7ab8] py-3 px-6 rounded-xl font-semibold text-center hover:bg-[#5f7ab8] hover:text-white transition-all duration-300"
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
