'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Suspense as SuspenseBoundary } from 'react';
import InfiniteProductList from '@/components/InfiniteProductList';
import ProductFilter from '@/components/ProductFilter';
import HolidayBanner from '@/components/HolidayBanner';
import EmptyState from '@/components/EmptyState';
import { ProductCardSkeleton } from '@/components/SkeletonLoader';
import { ArrowButton, CTABand, PageHero, Section } from '@/components/sections';
import type { Category, Product } from '@/types';

const ITEMS_PER_PAGE = 9;

export interface CategoryPageContentProps {
  category: Category;
  categoryProducts: Product[];
  categorySlug: string;
}

function CategoryContentInner({
  categoryProducts,
  categorySlug,
}: Omit<CategoryPageContentProps, 'category'>) {
  const searchParams = useSearchParams() ?? new URLSearchParams();
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

  const isEmpty = filteredProducts.length === 0 && !searchQuery;

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Filter Sidebar */}
      <aside className="flex-shrink-0 lg:w-80">
        <ProductFilter
          totalProducts={filteredProducts.length}
          currentCategory={categorySlug}
          onFilterChange={() => setRefreshKey(prev => prev + 1)}
          categories={categories}
        />
      </aside>

      {/* Main Content */}
      <div className="min-w-0 flex-1">
        {/* Results Count */}
        <div className="mb-8 flex items-center justify-between border-b border-navy/14 pb-6">
          <p className="text-sm text-muted">
            Hiển thị <span className="font-semibold text-navy">{filteredProducts.length}</span> sản phẩm
          </p>
        </div>

        {isEmpty ? (
          <EmptyState
            title="Chưa có sản phẩm trong danh mục này"
            description="Chúng tôi đang cập nhật danh mục. Liên hệ trực tiếp để được tư vấn thiết bị phù hợp."
            actionLabel="Liên hệ tư vấn"
            actionHref="/lien-he"
          />
        ) : (
          <InfiniteProductList
            initialProducts={filteredProducts.slice(0, ITEMS_PER_PAGE)}
            category={categorySlug}
            searchQuery={searchQuery}
            pageSize={ITEMS_PER_PAGE}
          />
        )}
      </div>
    </div>
  );
}

function CategoryContentFallback() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
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
    <>
      <PageHero
        eyebrow={category.name}
        title={`Sản phẩm ${category.name}`}
        image={category.image || '/images/place-holder/hiab-crane-truck.jpg'}
        intro={
          category.description ||
          `Thiết bị ${category.name.toLowerCase()} chính hãng, nhập khẩu trực tiếp và bảo hành tại Việt Nam.`
        }
        breadcrumbs={[
          { name: 'Trang chủ', href: '/' },
          { name: 'Sản phẩm', href: '/san-pham' },
          { name: category.name },
        ]}
      />

      {/* Holiday banner — collapses on days with no active holiday effect */}
      <div className="mx-auto flex w-full max-w-site justify-center px-5 py-12 md:px-gutter empty:hidden">
        <HolidayBanner variant="minimal" />
      </div>

      <Section>
        <SuspenseBoundary fallback={<CategoryContentFallback />}>
          <CategoryContentInner
            categoryProducts={categoryProducts}
            categorySlug={categorySlug}
          />
        </SuspenseBoundary>
      </Section>

      <CTABand
        eyebrow="Cần tư vấn kỹ thuật?"
        title={`Chọn đúng model ${category.name.toLowerCase()}`}
        intro="Kỹ sư của NEW ATLANTIC sẽ khảo sát điều kiện vận hành và đề xuất cấu hình phù hợp với công trình của bạn."
        actions={
          <>
            <ArrowButton href="/lien-he" variant="accent">
              Liên hệ tư vấn
            </ArrowButton>
            <ArrowButton href="/san-pham" variant="outline-light">
              Xem tất cả sản phẩm
            </ArrowButton>
          </>
        }
      />
    </>
  );
}
