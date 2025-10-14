import ProductCard from '@/components/ProductCard';
import { products, categories } from '@/lib/data';
import Link from 'next/link';

export const metadata = {
  title: 'Sản phẩm - NEW AIT',
  description: 'Danh sách sản phẩm thiết bị công nghiệp chính hãng từ WILL-BURT, HIAB, LOVOL, LIUGONG',
};

export default function ProductsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-[#5f7ab8] via-[#4a6199] to-[#3a4d7a] text-white pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl -top-48 -right-48"></div>
          <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl -bottom-48 -left-48"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl font-bold mb-4">Sản Phẩm</h1>
          <p className="text-xl text-gray-100">
            Danh sách đầy đủ các sản phẩm thiết bị công nghiệp chính hãng
          </p>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="bg-white shadow-md sticky top-20 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/san-pham"
              className="px-6 py-2.5 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Tất cả sản phẩm
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/san-pham/${category.slug}`}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-[#5f7ab8] hover:text-white transition-all"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-2">Tất cả sản phẩm</h2>
          <p className="text-gray-600 text-lg">Tìm thấy <span className="font-semibold text-[#5f7ab8]">{products.length}</span> sản phẩm</p>
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

