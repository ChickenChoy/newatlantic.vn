'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Suspense, useEffect, useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import { products, categories } from '@/lib/data';
import Link from 'next/link';
import { generateBreadcrumbSchema } from '@/lib/seo';
import { ProductCardSkeleton } from '@/components/SkeletonLoader';

const ITEMS_PER_PAGE = 9;

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const searchQuery = searchParams.get('q') || '';
  const [sortOption, setSortOption] = useState<string>('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query)) ||
        product.category.toLowerCase().includes(query)
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
  }, [searchQuery, sortOption]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const validPage = Math.min(Math.max(1, page), totalPages || 1);
  const validStartIdx = (validPage - 1) * ITEMS_PER_PAGE;
  const validEndIdx = validStartIdx + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(validStartIdx, validEndIdx);

  const handleSortChange = (newSort: string) => {
    setSortOption(newSort);
    setShowSortMenu(false);
    // Update URL without page parameter
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');
    router.push(`/san-pham?${params.toString()}`);
  };

  const sortOptions = [
    { value: 'newest', label: 'Mới nhất', icon: '🆕' },
    { value: 'name-asc', label: 'Tên A-Z', icon: '🔤' },
    { value: 'name-desc', label: 'Tên Z-A', icon: '🔤' },
  ];

  return (
    <>
      {/* Filter Bar - Giống như hình tin tức */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-sm text-gray-600">
          Hiển thị <span className="font-semibold text-[#5f7ab8]">{filteredProducts.length}</span> sản phẩm
        </div>
        
        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <Link
            href="/san-pham"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              pathname === '/san-pham'
                ? 'bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-[#5f7ab8] hover:bg-gray-50'
            }`}
          >
            Tất cả
          </Link>
          {categories.map((category) => {
            const isActive = pathname === `/san-pham/${category.slug}`;
            return (
              <Link
                key={category.id}
                href={`/san-pham/${category.slug}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-[#5f7ab8] hover:bg-gray-50'
                }`}
              >
                {category.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap">
        {paginatedProducts.map((product, index) => (
          <div 
            key={product.id}
            className="product-card-hidrokon"
            style={{ marginRight: index % 4 === 3 ? 0 : '32px', marginBottom: '32px' }}
          >
            <ProductCard 
              product={product}
              className=""
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {paginatedProducts.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
          <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-gray-500 text-xl font-medium mb-2">Không tìm thấy sản phẩm</p>
          <p className="text-gray-400 text-sm">Thử tìm kiếm từ khóa khác</p>
        </div>
      )}

      {/* Pagination */}
      {paginatedProducts.length > 0 && (
        <Pagination
          currentPage={validPage}
          totalPages={totalPages}
          totalItems={filteredProducts.length}
          itemsPerPage={ITEMS_PER_PAGE}
          baseUrl="/san-pham"
        />
      )}
    </>
  );
}

function ProductsPageFallback() {
  return (
    <div className="flex flex-wrap">
      {[...Array(8)].map((_, i) => (
        <div 
          key={i}
          className="product-card-hidrokon"
          style={{ marginRight: i % 4 === 3 ? 0 : '32px', marginBottom: '32px' }}
        >
          <div 
            className="bg-gray-200 animate-pulse"
            style={{
              borderRadius: '40px 150px 40px 40px',
              height: '450px'
            }}
          />
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

      <div className="bg-gray-50 min-h-screen pt-16">

      {/* Breadcrumb */}
      <div className="bg-gray-50  mt-4">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#5f7ab8] transition">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-[#5f7ab8] font-medium">Sản phẩm</span>
          </nav>
        </div>
      </div>


      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Tất cả sản phẩm
          </h2>
          <p className="text-sm text-gray-600">
            Khám phá bộ sưu tập thiết bị công nghiệp chính hãng của chúng tôi
          </p>
        </div>

        <Suspense fallback={<ProductsPageFallback />}>
          <ProductsPageContent />
        </Suspense>
      </div>
      </div>
    </>
  );
}

