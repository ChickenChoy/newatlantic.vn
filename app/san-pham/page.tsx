'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import { products, categories } from '@/lib/data';
import Link from 'next/link';
import { generateBreadcrumbSchema } from '@/lib/seo';
import Head from 'next/head';

const ITEMS_PER_PAGE = 9;

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  // Calculate pagination
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const validPage = Math.min(Math.max(1, page), totalPages || 1);
  const validStartIdx = (validPage - 1) * ITEMS_PER_PAGE;
  const validEndIdx = validStartIdx + ITEMS_PER_PAGE;
  const validPaginatedProducts = products.slice(validStartIdx, validEndIdx);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {validPaginatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={validPage}
        totalPages={totalPages}
        totalItems={products.length}
        itemsPerPage={ITEMS_PER_PAGE}
        baseUrl="/san-pham"
      />
    </>
  );
}

function ProductsPageFallback() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="bg-gray-200 rounded-2xl h-96 animate-pulse"></div>
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
      <div className="bg-gray-50 border-t border-[#e5e7eb] mt-4">
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

      {/* Categories Filter - Sticky */}
      <div className="sticky top-20 z-40">
        <div className="container mx-auto px-4">
          {/* Desktop Filter - Grid Layout */}
          <div className="hidden md:flex items-center gap-3 py-4 flex-wrap">
            <span className="text-sm font-semibold text-gray-600 mr-2">Danh mục:</span>
            <Link
              href="/san-pham"
              className="px-5 py-2 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all"
            >
              Tất cả
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/san-pham/${category.slug}`}
                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-[#5f7ab8] hover:text-white transition-all"
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Mobile Filter - Horizontal Scroll */}
          <div className="md:hidden py-3 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 min-w-max">
              <Link
                href="/san-pham"
                className="px-4 py-2 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white rounded-lg font-semibold text-xs whitespace-nowrap shadow-md"
              >
                🏠 Tất cả
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/san-pham/${category.slug}`}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-xs hover:bg-[#5f7ab8] hover:text-white transition-all whitespace-nowrap"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Tất cả sản phẩm
          </h2>
          <p className="text-sm text-gray-600">
            {products.length} sản phẩm
          </p>
        </div>

        {products.length > 0 ? (
          <Suspense fallback={<ProductsPageFallback />}>
            <ProductsPageContent />
          </Suspense>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-500 text-xl font-medium">Chưa có sản phẩm</p>
          </div>
        )}
      </div>
      </div>
    </>
  );
}

