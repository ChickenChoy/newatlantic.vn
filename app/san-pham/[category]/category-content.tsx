'use client';

import { useSearchParams, usePathname } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { Suspense as SuspenseBoundary } from 'react';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import { categories } from '@/lib/data';
import Link from 'next/link';

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
      {/* Filter Bar - Giống như trang sản phẩm chính */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-sm text-gray-600">
          Hiển thị <span className="font-semibold text-[#5f7ab8]">{categoryProducts.length}</span> sản phẩm
        </div>
        
        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <Link
            href="/san-pham"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              false // Always false here since we're on category page
                ? 'bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-[#5f7ab8] hover:bg-gray-50'
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
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-[#5f7ab8] hover:bg-gray-50'
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {paginatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="bg-gray-200 rounded-2xl h-96 animate-pulse"></div>
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
    <div className="bg-gray-50 min-h-screen pt-16">
      {/* Breadcrumb */}
      <div className="bg-gray-50  mt-4">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#5f7ab8] transition">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/san-pham" className="hover:text-[#5f7ab8] transition">
              Sản phẩm
            </Link>
            <span>/</span>
            <span className="text-[#5f7ab8] font-medium truncate">{category.name}</span>
          </nav>
        </div>
      </div>


      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
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
