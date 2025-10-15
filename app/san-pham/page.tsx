import ProductCard from '@/components/ProductCard';
import { products, categories } from '@/lib/data';
import Link from 'next/link';

export const metadata = {
  title: 'Sản phẩm - NEW ATLANTIC',
  description: 'Danh sách sản phẩm thiết bị công nghiệp chính hãng từ WILL-BURT, HIAB, LOVOL, LIUGONG',
};

export default function ProductsPage() {
  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-[#e5e7eb] mt-6">
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
        <div className="mb-12 text-center">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] bg-clip-text text-transparent">
            Tất cả sản phẩm
          </h2>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent to-[#5f7ab8]"></div>
            <div className="w-2 h-2 bg-[#5f7ab8] rounded-full"></div>
            <div className="w-16 h-1 bg-gradient-to-l from-transparent to-[#5f7ab8]"></div>
          </div>
          <p className="text-gray-600 text-lg">Tìm thấy <span className="font-bold text-[#5f7ab8] text-xl">{products.length}</span> sản phẩm</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

