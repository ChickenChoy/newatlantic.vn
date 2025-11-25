'use client';

import { useSearchParams, usePathname } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { Suspense as SuspenseBoundary } from 'react';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import { categories } from '@/lib/data';
import Link from 'next/link';
import { ProductCardSkeleton } from '@/components/SkeletonLoader';

const ITEMS_PER_PAGE = 9;

export interface CategoryPageContentProps {
  category: any;
  categoryProducts: any[];
  categorySlug: string;
}

function CategoryContentInner({
  category,
  categoryProducts,
  categorySlug,
}: CategoryPageContentProps) {
  const searchParams = useSearchParams();
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  // Calculate pagination
  const totalPages = Math.ceil(categoryProducts.length / ITEMS_PER_PAGE);
  const validPage = Math.min(Math.max(1, page), totalPages || 1);
  const startIdx = (validPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const paginatedProducts = categoryProducts.slice(startIdx, endIdx);

  if (categoryProducts.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
        <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-gray-500 text-xl font-medium">Chưa có sản phẩm trong danh mục này</p>
      </div>
    );
  }

  return (
    <>
      {/* Sticky Filter Bar */}
      <div className="sticky top-16 z-40 mb-6 bg-white/95 backdrop-blur-md shadow-md rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-sm text-gray-600">
            Hiển thị <span className="font-semibold text-blue-600">{categoryProducts.length}</span> sản phẩm
          </div>
          
          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <Link
              href="/san-pham"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                false // Always false here since we're on category page
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 shadow-sm'
              }`}
            >
              Tất cả
            </Link>
            {categories.map((cat) => {
              const isActive = cat.slug === categorySlug;
              return (
                <Link
                  key={cat.id}
                  href={`/san-pham/${cat.slug}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 shadow-sm'
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Products Grid - Using CSS Grid instead of manual margins */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {paginatedProducts.map((product) => (
          <ProductCard 
            key={product.id}
            product={product}
          />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={validPage}
        totalPages={totalPages}
        totalItems={categoryProducts.length}
        itemsPerPage={ITEMS_PER_PAGE}
        baseUrl={`/san-pham/${categorySlug}`}
      />
    </>
  );
}

function CategoryContentFallback() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
      {[...Array(8)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function CategoryPageContent({
  category,
  categoryProducts,
  categorySlug,
}: CategoryPageContentProps) {
  return (
    <div className="bg-white min-h-screen pt-16 relative overflow-hidden">
      {/* Background decorative elements - Subtle blue accent */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50/40 rounded-full blur-3xl"></div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white mt-4 relative z-10">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/san-pham" className="hover:text-blue-600 transition">
              Sản phẩm
            </Link>
            <span>/</span>
            <span className="text-blue-600 font-medium truncate">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium mb-4 tracking-wide uppercase">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            Thiết bị công nghiệp
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {category.name}
          </h2>
          <p className="text-sm text-gray-600">
            Khám phá bộ sưu tập {category.name.toLowerCase()} chính hãng của chúng tôi
          </p>
        </div>

        <SuspenseBoundary fallback={<CategoryContentFallback />}>
          <CategoryContentInner 
            category={category}
            categoryProducts={categoryProducts}
            categorySlug={categorySlug}
          />
        </SuspenseBoundary>
      </div>
    </div>
  );
}
