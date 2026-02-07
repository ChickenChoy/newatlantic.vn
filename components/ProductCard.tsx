'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import QuickViewModal from './QuickViewModal';
import { WishlistManager } from '@/lib/wishlist';
import { showToast } from '@/lib/toast-utils';

interface ProductCardProps {
  product: Product;
  className?: string;
  hideQuickView?: boolean;
  priority?: boolean; // Add priority prop for above-fold images
}

export default function ProductCard({
  product,
  className = '',
  hideQuickView = false,
  priority = false // Default to false, but should be true for above-fold cards
}: ProductCardProps) {
  const [showQuickView, setShowQuickView] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    // Check if product is in wishlist on mount
    setIsInWishlist(WishlistManager.isInWishlist(product.id));

    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      setIsInWishlist(WishlistManager.isInWishlist(product.id));
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
  }, [product.id]);

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  const handleWishlistToggle = (liked: boolean) => {
    if (!liked) {
      WishlistManager.removeFromWishlist(product.id);
      showToast.info('Đã xóa khỏi yêu thích');
    } else {
      WishlistManager.addToWishlist(product);
      showToast.success(`Đã thêm "${product.name}" vào yêu thích`);
    }
  };

  // Extract product model and category from name
  const getProductModel = () => {
    // Try to extract model number/name (first part before category)
    const parts = product.name.split(' ');
    if (parts.length > 1) {
      // Return first 2-3 words as model
      return parts.slice(0, Math.min(3, parts.length - 1)).join(' ');
    }
    return product.name;
  };

  const getProductCategory = () => {
    // Return category name for display
    return product.categoryName || product.category;
  };

  return (
    <>
      <Link
        href={`/san-pham/${product.categorySlug || product.category}/${product.slug}`}
        className={`block relative group h-full ${className}`}
      >
        {/* Background - Premium card with enhanced shadows */}
        <div className="urun-liste-hover absolute inset-0 transition-all duration-500 rounded-2xl product-card-bg overflow-hidden bg-gradient-to-br from-slate-800/95 to-slate-900/98 shadow-[0_4px_20px_rgba(0,0,0,0.25),0_0_0_1px_rgba(255,255,255,0.05)] border border-white/8 z-10" />

        {/* Image Container */}
        <div className="relative w-full group-hover:z-30 transition-all duration-300 pt-12 pb-6 px-6 md:pt-[60px] md:pb-[30px] md:px-[35px] z-20">
          {product.image ? (
            <div className="relative w-full aspect-[4/3] min-h-[160px] max-h-[160px] md:min-h-[240px] md:max-h-[240px]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply [filter:contrast(1.1)_brightness(1.05)]"
                quality={95}
                priority={priority}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
            </div>
          ) : (
            <div className="w-full aspect-[4/3] flex items-center justify-center text-gray-500 bg-white/5 min-h-[160px] max-h-[160px] md:min-h-[240px] md:max-h-[240px]">
              <svg className="w-20 h-20 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Quick View Button */}
          {!hideQuickView && (
            <button
              onClick={handleQuickView}
              className="absolute top-4 left-4 z-50 w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-110 opacity-0 md:opacity-0 md:group-hover:opacity-100 rounded-full bg-white/95 shadow-md hover:shadow-lg hover:bg-white"
              aria-label={`Xem nhanh sản phẩm ${product.name}`}
              title="Xem nhanh"
            >
              <svg
                className="w-5 h-5 text-slate-700 group-hover:text-primary transition-colors"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          )}

        </div>

        {/* Title Box */}
        <div className="relative px-6 pb-8 md:px-[35px] md:pb-[45px] z-15">
          {/* Separator line - Premium gradient */}
          <div className="product-separator transition-all duration-500 w-10 h-1 md:w-[60px] md:h-[5px] mb-4 md:mb-5 group-hover:w-16 md:group-hover:w-[80px] bg-gradient-to-r from-[#3b5998] via-[#5a7fc2] to-[#14b8a6] rounded shadow-[0_0_10px_rgba(59,89,152,0.3)]" />

          {/* Product Model/Name - Enhanced typography */}
          <div className="product-model transition-all duration-500 text-base md:text-xl font-bold leading-tight mb-2 md:mb-2.5 break-words line-clamp-2 text-white font-sans min-h-[2.4em] [text-shadow:0_1px_2px_rgba(0,0,0,0.2)]">
            {product.name}
          </div>

          {/* Product Category/Type - Better contrast */}
          <div className="product-category transition-all duration-500 text-xs md:text-sm font-medium leading-snug flex items-center gap-2 text-slate-400 font-sans">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-400/70"></span>
            {getProductCategory()}
          </div>
        </div>
      </Link>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  );
}
