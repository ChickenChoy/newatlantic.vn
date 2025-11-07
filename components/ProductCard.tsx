'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import QuickViewModal from './QuickViewModal';
import { WishlistManager } from '@/lib/wishlist';
import { TiltCard, HeartButton } from './micro-interactions';

interface ProductCardProps {
  product: Product;
  className?: string;
  hideQuickView?: boolean;
}

export default function ProductCard({ product, className = '', hideQuickView = false }: ProductCardProps) {
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
    } else {
      WishlistManager.addToWishlist(product);
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
        {/* Background - giống Hidrokon với góc bo tròn lớn */}
        <div 
          className="urun-liste-hover absolute transition-all duration-500"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#f0f0f0',
            borderRadius: '40px 150px 40px 40px',
            zIndex: 10,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
          }}
        />

        {/* Image Container - giống Hidrokon */}
        <div 
          className="relative w-full"
          style={{ 
            padding: '60px 35px 30px', 
            zIndex: 20
          }}
        >
              {product.image ? (
                <div className="relative w-full" style={{ height: '240px' }}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-500"
                    style={{
                      mixBlendMode: 'multiply',
                      filter: 'contrast(1.1) brightness(1.05)'
                    }}
                    quality={95}
                    priority={false}
                  />
                </div>
              ) : (
            <div className="w-full flex items-center justify-center text-gray-300 bg-gray-50" style={{ height: '240px' }}>
              <svg className="w-20 h-20 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Quick View Button - hiển thị khi hover */}
          {!hideQuickView && (
            <button
              onClick={handleQuickView}
              className="absolute top-2 left-4 z-50 w-14 h-14 flex items-center justify-center transition-all duration-300 hover:scale-110 opacity-70 group-hover:opacity-100"
              title="Xem nhanh"
            >
              <svg 
                className="w-8 h-8 text-[#5f7ab8] group-hover:text-white drop-shadow-lg transition-colors duration-300" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          )}
        </div>

        {/* Title Box - giống Hidrokon */}
        <div 
          className="relative"
          style={{ 
            padding: '0 35px 45px', 
            zIndex: 15
          }}
        >
          {/* Separator line */}
          <div 
            className="product-separator transition-all duration-500"
            style={{
              width: '50px',
              height: '6px',
              backgroundColor: 'rgb(60, 60, 60)',
              borderRadius: '3px',
              marginBottom: '20px'
            }}
          />
          
          {/* Product Model/Name */}
          <div 
            className="product-model transition-all duration-500"
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: 'rgb(60, 60, 60)',
              textAlign: 'left',
              lineHeight: '1.4',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              marginBottom: '6px',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto',
              minHeight: '1.8em'
            }}
          >
            {product.name}
          </div>
          {/* Product Category/Type */}
          <div 
            className="product-category transition-all duration-500"
            style={{
              fontSize: '14px',
              fontWeight: 400,
              color: '#c17b5a',
              lineHeight: '1.4',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
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

