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
      title: 'Không tìm thấy - NEW AIT',
    };
  }

  return {
    title: `${category.name} - NEW AIT`,
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
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-[#5f7ab8] via-[#4a6199] to-[#3a4d7a] text-white pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl -top-48 -right-48"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <nav className="text-sm mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-gray-200 transition">Trang chủ</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/san-pham" className="hover:text-gray-200 transition">Sản phẩm</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-200">{category.name}</span>
          </nav>
          <h1 className="text-5xl font-bold mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-xl text-gray-100">{category.description}</p>
          )}
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="bg-white shadow-md sticky top-20 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/san-pham"
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-[#5f7ab8] hover:text-white transition-all"
            >
              Tất cả sản phẩm
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/san-pham/${cat.slug}`}
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                  cat.slug === categorySlug
                    ? 'bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-[#5f7ab8] hover:text-white'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-2">{category.name}</h2>
          <p className="text-gray-600 text-lg">Tìm thấy <span className="font-semibold text-[#5f7ab8]">{categoryProducts.length}</span> sản phẩm</p>
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

