'use client';

import { useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Suspense as SuspenseBoundary } from 'react';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import ProductFilter from '@/components/ProductFilter';
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
  const pathname = usePathname();
  const [refreshKey, setRefreshKey] = useState(0);
  
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const searchQuery = searchParams.get('q') || '';
  const sortOption = searchParams.get('sort') || 'newest';

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, searchQuery, sortOption]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...categoryProducts];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query)) ||
        product.category.toLowerCase().includes(query) ||
        product.categoryName.toLowerCase().includes(query)
      );
    }

    // Sort products
    switch (sortOption) {
      case 'name-asc':
        return result.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
      case 'name-desc':
        return result.sort((a, b) => b.name.localeCompare(a.name, 'vi'));
      case 'newest':
      default:
        return result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    }
  }, [categoryProducts, searchQuery, sortOption, refreshKey]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const validPage = Math.min(Math.max(1, page), totalPages || 1);
  const startIdx = (validPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIdx, endIdx);

  return (
    <>
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
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
          <div className="text-sm text-gray-600">
            Tìm thấy <span className="font-bold text-blue-600 text-lg">{filteredProducts.length}</span> sản phẩm
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 && !searchQuery ? (
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-80 flex-shrink-0">
            <ProductFilter 
              totalProducts={0}
              currentCategory={categorySlug}
              onFilterChange={() => setRefreshKey(prev => prev + 1)}
            />
          </aside>
          <div className="flex-1">
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-500 text-xl font-medium">Chưa có sản phẩm trong danh mục này</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <ProductFilter 
              totalProducts={filteredProducts.length}
              currentCategory={categorySlug}
              onFilterChange={() => setRefreshKey(prev => prev + 1)}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {paginatedProducts.map((product) => (
            <ProductCard 
              key={product.id}
              product={product}
            />
          ))}
        </div>

        {/* Empty State for Search */}
        {paginatedProducts.length === 0 && searchQuery && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
              <p className="text-gray-600 mb-6">Không có sản phẩm nào phù hợp với từ khóa "{searchQuery}"</p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {paginatedProducts.length > 0 && (
          <Pagination
            currentPage={validPage}
            totalPages={totalPages}
            totalItems={filteredProducts.length}
            itemsPerPage={ITEMS_PER_PAGE}
            baseUrl={`/san-pham/${categorySlug}`}
          />
        )}
      </div>
    </div>
      )}
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
    <div className="bg-white min-h-screen pt-20 md:pt-24 relative overflow-hidden">
      {/* Background decorative elements - Subtle blue accent */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50/40 rounded-full blur-3xl"></div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white mt-12 md:mt-16 relative z-10">
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
