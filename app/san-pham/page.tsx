'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import InfiniteProductList from '@/components/InfiniteProductList';
import ProductFilter from '@/components/ProductFilter';
import Link from 'next/link';
import { generateBreadcrumbSchema } from '@/lib/seo';
import { ProductCardSkeleton } from '@/components/SkeletonLoader';
import HolidayBanner from '@/components/HolidayBanner';
import { Product, Category } from '@/types';
import { ProductListSkeleton } from '@/components/LoadingIndicator';

const ITEMS_PER_PAGE = 9;

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const [refreshKey, setRefreshKey] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const searchQuery = searchParams.get('q') || '';
  const sortOption = searchParams.get('sort') || 'newest';

  // Fetch products and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Initialize data first
        await fetch('/api/init', { method: 'POST' });

        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
        ]);

        if (productsRes.ok) {
          const data = await productsRes.json();
          setProducts(data);
        }

        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, searchQuery, sortOption]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => p.enabled !== false);

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
  }, [products, searchQuery, sortOption]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const validPage = Math.min(Math.max(1, page), totalPages || 1);
  const validStartIdx = (validPage - 1) * ITEMS_PER_PAGE;
  const validEndIdx = validStartIdx + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(validStartIdx, validEndIdx);

  // Popular search keywords for suggestions
  const popularKeywords = ['WILL-BURT', 'HIAB', 'SKYMARK', 'Cột tự nâng', 'Cẩu tự hành', 'Xe nâng'];

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-80 flex-shrink-0">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg animate-pulse">
            <div className="h-6 bg-white/20 rounded w-1/2 mb-6"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-white/10 rounded-lg"></div>
              ))}
            </div>
          </div>
        </aside>
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-full">
                <ProductCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar */}
        <aside className="lg:w-80 flex-shrink-0">
          <ProductFilter
            totalProducts={filteredProducts.length}
            onFilterChange={() => setRefreshKey(prev => prev + 1)}
            categories={categories}
          />
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Results Count */}
          <div className="mb-6 flex items-center justify-between">
            <div className="text-sm text-gray-300">
              Hiển thị <span className="font-bold text-blue-400">{filteredProducts.length}</span> sản phẩm
            </div>
          </div>

          {/* Infinite Scroll Products List */}
          <InfiniteProductList
            initialProducts={filteredProducts.slice(0, ITEMS_PER_PAGE)}
            searchQuery={searchQuery}
            pageSize={ITEMS_PER_PAGE}
          />
        </div>
      </div>
    </>
  );
}

function ProductsPageFallback() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-full">
          <ProductCardSkeleton />
        </div>
      ))}
    </div>
  );
}

export default function ProductsPage() {
  // Generate breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Trang chủ', url: '/' },
    { name: 'Sản phẩm', url: '/san-pham' },
  ]);

  // Update page title
  useEffect(() => {
    document.title = 'Sản phẩm - Thiết bị công nghiệp chính hãng | NEW ATLANTIC';
  }, []);

  return (
    <>
      {/* JSON-LD Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

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
                Thiết bị công nghiệp
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                Tất cả <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Sản Phẩm</span>
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto mb-8">
                Khám phá bộ sưu tập thiết bị công nghiệp chính hãng, chất lượng cao từ các thương hiệu hàng đầu.
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
          <Suspense fallback={<ProductsPageFallback />}>
            <ProductsPageContent />
          </Suspense>
        </div>
      </div>
    </>
  );
}
