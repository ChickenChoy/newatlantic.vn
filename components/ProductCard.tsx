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

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist) {
      WishlistManager.removeFromWishlist(product.id);
      showToast.info('Đã xóa khỏi yêu thích');
    } else {
      WishlistManager.addToWishlist(product);
      showToast.success(`Đã thêm "${product.name}" vào yêu thích`);
    }
  };

  const getProductCategory = () => {
    // Return category name for display
    return product.categoryName || product.category;
  };

  return (
    <>
      <Link
        href={`/san-pham/${product.categorySlug || product.category}/${product.slug}`}
        className={`group flex h-full flex-col overflow-hidden rounded-card border border-navy/14 bg-background transition-colors duration-300 ease-brand hover:border-navy/30 ${className}`}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-surface">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-6 transition-transform duration-[400ms] ease-brand group-hover:scale-105 md:p-8"
              quality={95}
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-navy/14">
              <svg className="h-20 w-20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Hover actions */}
          <div className="absolute right-4 top-4 flex flex-col gap-2">
            <button
              onClick={handleWishlistToggle}
              className="flex h-10 w-10 items-center justify-center rounded-pill border border-navy/14 bg-background text-navy transition-all duration-300 ease-brand hover:scale-105 hover:border-accent hover:text-accent"
              aria-label={
                isInWishlist
                  ? `Xóa ${product.name} khỏi yêu thích`
                  : `Thêm ${product.name} vào yêu thích`
              }
              aria-pressed={isInWishlist}
              title={isInWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
            >
              <svg
                className={`h-5 w-5 transition-colors ${isInWishlist ? 'text-accent' : ''}`}
                fill={isInWishlist ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>

            {!hideQuickView && (
              <button
                onClick={handleQuickView}
                className="flex h-10 w-10 items-center justify-center rounded-pill border border-navy/14 bg-background text-navy opacity-0 transition-all duration-300 ease-brand hover:scale-105 hover:border-accent hover:text-accent focus-visible:opacity-100 group-hover:opacity-100"
                aria-label={`Xem nhanh sản phẩm ${product.name}`}
                title="Xem nhanh"
              >
                <svg
                  className="h-5 w-5"
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
        </div>

        {/* Body */}
        <div className="flex flex-grow flex-col p-6 md:p-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-accent">
            {getProductCategory()}
          </p>

          <h3 className="font-display text-d6 uppercase leading-display tracking-display text-navy transition-colors duration-300 ease-brand group-hover:text-accent">
            {product.name}
          </h3>

          <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-navy transition-colors duration-300 ease-brand group-hover:text-accent">
            Xem chi tiết
            <svg
              className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
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
