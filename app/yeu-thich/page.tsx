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
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-16 bg-[#FAFAFA] relative overflow-hidden">
      {/* Background decorative elements - Subtle pink/rose accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-100/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rose-100/40 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
              Danh sách quan tâm
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Sản Phẩm <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600">Yêu Thích</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
              {isLoading
                ? 'Đang tải danh sách...'
                : wishlist.length > 0
                  ? `Bạn đang quan tâm đến ${wishlist.length} sản phẩm. Hãy liên hệ ngay để được tư vấn chi tiết.`
                  : 'Lưu lại những sản phẩm bạn quan tâm để xem lại sau.'}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : wishlist.length > 0 ? (
            <div className="animate-fade-in">
              <div className="flex justify-end mb-8">
                <button
                  onClick={clearAll}
                  className="group inline-flex items-center gap-2 px-4 py-2 bg-white border border-red-100 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-200 font-medium text-sm transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Xóa tất cả
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {wishlist.map((product) => (
                  <div
                    key={product.id}
                    className="relative group animate-fade-in-up"
                  >
                    {/* Remove from wishlist button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFromWishlist(product.id);
                      }}
                      className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 transform hover:scale-110 border border-gray-100"
                      title="Xóa khỏi yêu thích"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="h-full transform transition-all duration-500 hover:-translate-y-2">
                      <ProductCard
                        product={product}
                        className="h-full shadow-lg hover:shadow-2xl hover:shadow-pink-500/10 border border-gray-100 rounded-2xl overflow-hidden"
                        hideQuickView={true}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 max-w-2xl mx-auto animate-fade-in-up">
              <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-slow">
                <svg className="w-12 h-12 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Chưa có sản phẩm yêu thích
              </h3>
              <p className="text-gray-600 mb-10 max-w-md mx-auto leading-relaxed">
                Hãy dạo qua danh mục sản phẩm của chúng tôi và thả tim cho những sản phẩm bạn quan tâm nhé!
              </p>
              <Link
                href="/san-pham"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 hover:-translate-y-1 transition-all duration-300"
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