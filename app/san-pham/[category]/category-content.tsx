'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Suspense as SuspenseBoundary } from 'react';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import ProductFilter from '@/components/ProductFilter';
import HolidayBanner from '@/components/HolidayBanner';
import Link from 'next/link';
import { ProductCardSkeleton } from '@/components/SkeletonLoader';
import type { Category, Product } from '@/types';

const ITEMS_PER_PAGE = 9;

export interface CategoryPageContentProps {
  category: Category;
  categoryProducts: Product[];
  categorySlug: string;
}

function CategoryContentInner({
  category,
  categoryProducts,
  categorySlug,
}: CategoryPageContentProps) {
  const searchParams = useSearchParams();
  const [refreshKey, setRefreshKey] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);

  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const searchQuery = searchParams.get('q') || '';
  const sortOption = searchParams.get('sort') || 'newest';

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

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
      {/* Results Count */}
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-gray-300">
          Hiển thị <span className="font-bold text-blue-400">{filteredProducts.length}</span> sản phẩm
        </div>
      </div>

      {filteredProducts.length === 0 && !searchQuery ? (
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-80 flex-shrink-0">
            <ProductFilter
              totalProducts={0}
              currentCategory={categorySlug}
              onFilterChange={() => setRefreshKey(prev => prev + 1)}
              categories={categories}
            />
          </aside>
          <div className="flex-1">
            <div className="text-center py-20 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10">
              <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-400 text-xl font-medium">Chưa có sản phẩm trong danh mục này</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <ProductFilter
              totalProducts={filteredProducts.length}
              currentCategory={categorySlug}
              onFilterChange={() => setRefreshKey(prev => prev + 1)}
              categories={categories}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="h-full"
                />
              ))}
            </div>

            {/* Empty State for Search */}
            {paginatedProducts.length === 0 && searchQuery && (
              <div className="text-center py-20 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="max-w-md mx-auto">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Không tìm thấy sản phẩm</h3>
                  <p className="text-gray-400 mb-6">Không có sản phẩm nào phù hợp với từ khóa "{searchQuery}"</p>
                </div>
              </div>
            )}

            {/* Pagination */}
            {paginatedProducts.length > 0 && (
              <div className="mt-12">
                <Pagination
                  currentPage={validPage}
                  totalPages={totalPages}
                  totalItems={filteredProducts.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  baseUrl={`/san-pham/${categorySlug}`}
                />
              </div>
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
    <div className="bg-[#050c3a] min-h-screen pt-24 sm:pt-28 md:pt-32 relative overflow-hidden">
      {/* Background decorative elements - Subtle blue accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 border-b border-white/10">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              {category.name}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Sản Phẩm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{category.name}</span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto mb-8">
              {category.description || `Khám phá bộ sưu tập ${category.name.toLowerCase()} chính hãng, chất lượng cao từ các thương hiệu hàng đầu thế giới.`}
            </p>

            {/* Holiday Banner - Centered Minimal */}
            <div className="flex justify-center">
              <HolidayBanner variant="minimal" />
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12 relative z-10">
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
