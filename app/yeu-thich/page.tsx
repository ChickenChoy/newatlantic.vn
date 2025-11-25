'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { WishlistManager } from '@/lib/wishlist';
import { Product } from '@/types';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    try {
      const items = WishlistManager.getWishlist();
      setWishlist(items);
    } catch (error) {
      console.error('Error loading wishlist:', error);
      setWishlist([]);
    } finally {
      setIsLoading(false);
    }

    const handleWishlistUpdate = () => {
      try {
        const updatedItems = WishlistManager.getWishlist();
        setWishlist(updatedItems);
      } catch (error) {
        console.error('Error updating wishlist:', error);
      }
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, []);

  const removeFromWishlist = (productId: string) => {
    WishlistManager.removeFromWishlist(productId);
  };

  const clearAll = () => {
    if (confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm yêu thích?')) {
      WishlistManager.clearWishlist();
    }
  };

  if (!hasMounted) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#5f7ab8]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-white relative overflow-hidden">
        {/* Background decorative elements - Subtle pink/rose accent */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-100/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-50/40 rounded-full blur-3xl"></div>
        </div>

      {/* Breadcrumb Navigation */}
      <div className="bg-white mt-4 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link className="hover:text-pink-600 transition" href="/">Trang chủ</Link>
            <span>/</span>
            <span className="text-pink-600 font-medium">Yêu thích</span>
          </nav>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-pink-50 text-pink-700 rounded-full text-xs font-medium mb-4 tracking-wide uppercase">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              Sản phẩm yêu thích
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sản phẩm yêu thích
            </h1>
            <p className="text-gray-600">
              {isLoading 
                ? 'Đang tải danh sách...' 
                : wishlist.length > 0 
                  ? `Bạn có ${wishlist.length} sản phẩm trong danh sách yêu thích` 
                  : 'Chưa có sản phẩm nào trong danh sách yêu thích'}
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#5f7ab8]"></div>
              </div>
            </div>
          ) : wishlist.length > 0 ? (
            <>
              <div className="flex justify-end mb-6">
                <button
                  onClick={clearAll}
                  className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Xóa tất cả
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {wishlist.map((product) => (
                  <div 
                    key={product.id}
                    className="relative group"
                  >
                    {/* Remove from wishlist button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFromWishlist(product.id);
                      }}
                      className="absolute top-4 left-4 z-50 w-11 h-11 flex items-center justify-center transition-all duration-300 hover:scale-110 group-hover:opacity-100 opacity-70 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
                      title="Xóa khỏi yêu thích"
                    >
                      <svg 
                        className="w-6 h-6 text-red-500 group-hover:text-red-600 transition-colors duration-300" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>
                    <ProductCard 
                      product={product}
                      className="h-full"
                      hideQuickView={true}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Chưa có sản phẩm yêu thích
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Thêm sản phẩm vào danh sách yêu thích để dễ dàng theo dõi và so sánh
              </p>
              <Link
                href="/san-pham"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Khám phá sản phẩm
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}