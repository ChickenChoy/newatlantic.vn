import ProductCard from '@/components/ProductCard';
import { products, categories } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = categories.find(c => c.slug === categorySlug);
  
  if (!category) {
    return {
      title: 'Không tìm thấy - NEW ATLANTIC',
    };
  }

  return {
    title: `${category.name} - NEW ATLANTIC`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = categories.find(c => c.slug === categorySlug);
  
  if (!category) {
    notFound();
  }

  const categoryProducts = products.filter(p => p.categorySlug === categorySlug);

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
            <Link href="/san-pham" className="hover:text-[#5f7ab8] transition">
              Sản phẩm
            </Link>
            <span>/</span>
            <span className="text-[#5f7ab8] font-medium truncate">{category.name}</span>
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
              className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-[#5f7ab8] hover:text-white transition-all"
            >
              Tất cả
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/san-pham/${cat.slug}`}
                className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${
                  cat.slug === categorySlug
                    ? 'bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-[#5f7ab8] hover:text-white'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Mobile Filter - Horizontal Scroll */}
          <div className="md:hidden py-3 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 min-w-max">
              <Link
                href="/san-pham"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-xs hover:bg-[#5f7ab8] hover:text-white transition-all whitespace-nowrap"
              >
                🏠 Tất cả
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/san-pham/${cat.slug}`}
                  className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all whitespace-nowrap ${
                    cat.slug === categorySlug
                      ? 'bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-[#5f7ab8] hover:text-white'
                  }`}
                >
                  {cat.name}
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
            {category.name}
          </h2>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent to-[#5f7ab8]"></div>
            <div className="w-2 h-2 bg-[#5f7ab8] rounded-full"></div>
            <div className="w-16 h-1 bg-gradient-to-l from-transparent to-[#5f7ab8]"></div>
          </div>
          <p className="text-gray-600 text-lg">Tìm thấy <span className="font-bold text-[#5f7ab8] text-xl">{categoryProducts.length}</span> sản phẩm</p>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-500 text-xl font-medium">Chưa có sản phẩm trong danh mục này</p>
          </div>
        )}
      </div>
    </div>
  );
}

