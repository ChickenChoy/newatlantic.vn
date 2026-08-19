'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import InfiniteProductList from '@/components/InfiniteProductList';
import ProductFilter from '@/components/ProductFilter';
import { generateBreadcrumbSchema } from '@/lib/seo';
import { ProductCardSkeleton } from '@/components/SkeletonLoader';
import HolidayBanner from '@/components/HolidayBanner';
import { Product, Category } from '@/types';
import { ArrowButton, CTABand, PageHero, Section } from '@/components/sections';

const ITEMS_PER_PAGE = 9;

function ProductsPageContent() {
  const searchParams = useSearchParams() ?? new URLSearchParams();
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

  if (loading) {
    return (
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="flex-shrink-0 lg:w-80">
          <div className="animate-pulse rounded-card border border-navy/14 bg-surface p-6">
            <div className="mb-6 h-6 w-1/2 rounded-pill bg-navy/14"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 rounded-card bg-navy/14"></div>
              ))}
            </div>
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 lg:gap-8 xl:grid-cols-3">
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
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Filter Sidebar */}
      <aside className="flex-shrink-0 lg:w-80">
        <ProductFilter
          totalProducts={filteredProducts.length}
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

        {/* Infinite Scroll Products List */}
        <InfiniteProductList
          initialProducts={filteredProducts.slice(0, ITEMS_PER_PAGE)}
          searchQuery={searchQuery}
          pageSize={ITEMS_PER_PAGE}
        />
      </div>
    </div>
  );
}

function ProductsPageFallback() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
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

      <PageHero
        eyebrow="Thiết bị công nghiệp"
        title="Tất cả sản phẩm"
        image="/images/place-holder/telescopic-mast-tower.jpg"
        intro="Thiết bị chính hãng từ WILL-BURT, HIAB, SKYMARK, LOVOL và EFFER — nhập khẩu trực tiếp, bảo hành tại Việt Nam."
        breadcrumbs={[
          { name: 'Trang chủ', href: '/' },
          { name: 'Sản phẩm' },
        ]}
      />

      {/* Holiday banner — collapses on days with no active holiday effect */}
      <div className="mx-auto flex w-full max-w-site justify-center px-5 py-12 md:px-gutter empty:hidden">
        <HolidayBanner variant="minimal" />
      </div>

      <Section>
        <Suspense fallback={<ProductsPageFallback />}>
          <ProductsPageContent />
        </Suspense>
      </Section>

      <CTABand
        eyebrow="Không tìm thấy thiết bị bạn cần?"
        title="Gửi yêu cầu, chúng tôi tìm giúp bạn"
        intro="NEW ATLANTIC nhập khẩu theo đơn hàng riêng. Cho chúng tôi biết thông số, kỹ sư sẽ báo giá và tiến độ."
        actions={
          <>
            <ArrowButton href="/lien-he" variant="accent">
              Gửi yêu cầu
            </ArrowButton>
            <ArrowButton href="/page-download-catalog" variant="outline-light">
              Tải catalog
            </ArrowButton>
          </>
        }
      />
    </>
  );
}
