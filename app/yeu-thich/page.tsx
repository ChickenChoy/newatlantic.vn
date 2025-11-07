'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link className="hover:text-[#5f7ab8] transition" href="/">Trang chủ</Link>
            <span>/</span>
            <span className="text-[#5f7ab8] font-medium">Yêu thích</span>
          </nav>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
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

              <div className="flex flex-wrap" style={{ margin: '0 -16px' }}>
                {wishlist.map((product, index) => (
                  <div key={product.id} className="w-full md:w-1/2 lg:w-1/3 px-4" style={{ marginBottom: '32px' }}>
                    <div
                      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 group h-full flex flex-col"
                    >
                    <Link href={`/san-pham/${product.categorySlug}/${product.slug}`}>
                      <div className="relative h-56 bg-gray-50 overflow-hidden">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}

                        <button
                          onClick={() => removeFromWishlist(product.id)}
                          className="absolute top-4 right-4 w-10 h-10 bg-white/95 hover:bg-red-500 text-gray-700 hover:text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                          title="Xóa khỏi yêu thích"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>

                        <div className="absolute bottom-4 left-4">
                          <span className="bg-white/95 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
                            {product.category}
                          </span>
                        </div>
                      </div>
                    </Link>

                    <div className="p-5 flex-1 flex flex-col">
                      <Link href={`/san-pham/${product.categorySlug}/${product.slug}`}>
                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 hover:text-[#5f7ab8] transition-colors">
                          {product.name}
                        </h3>
                        {product.description && (
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                            {product.description}
                          </p>
                        )}
                      </Link>

                      <div className="flex gap-2 mt-auto">
                        <Link
                          href={`/san-pham/${product.categorySlug}/${product.slug}`}
                          className="flex-1 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white py-2 px-4 rounded-lg font-semibold text-center hover:shadow-lg hover:scale-105 transition-all text-sm"
                        >
                          Xem chi tiết
                        </Link>
                        <Link
                          href="/lien-he"
                          className="flex-1 border-2 border-[#5f7ab8] text-[#5f7ab8] py-2 px-4 rounded-lg font-semibold text-center hover:bg-[#5f7ab8] hover:text-white transition-all text-sm"
                        >
                          Liên hệ
                        </Link>
                      </div>
                    </div>
                    </div>
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
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
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