import { products } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface ProductPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    category: product.categorySlug,
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find(p => p.slug === slug);
  
  if (!product) {
    return {
      title: 'Không tìm thấy - NEW ATLANTIC',
    };
  }

  return {
    title: `${product.name} - NEW ATLANTIC`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find(p => p.slug === slug);
  
  if (!product) {
    notFound();
  }

  // Get related products
  const relatedProducts = products
    .filter(p => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-[#e5e7eb] mt-4 mb-4">
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
            <Link href={`/san-pham/${product.categorySlug}`} className="hover:text-[#5f7ab8] transition">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-[#5f7ab8] font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl shadow-xl p-8 lg:p-12 mb-16">
          {/* Product Image */}
          <div>
            <div className="relative h-[500px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-lg">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <svg className="w-40 h-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {product.featured && (
                <div className="absolute top-6 right-6 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white px-5 py-2 rounded-full text-sm font-bold shadow-xl">
                  ⭐ Sản phẩm nổi bật
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <Link
                href={`/san-pham/${product.categorySlug}`}
                className="inline-block text-sm text-[#5f7ab8] font-bold bg-[#5f7ab8]/10 px-4 py-2 rounded-full hover:bg-[#5f7ab8] hover:text-white transition-all"
              >
                {product.category}
              </Link>
            </div>
            <h1 className="text-4xl font-bold mb-6 leading-tight">{product.name}</h1>
            
            {product.description && (
              <p className="text-gray-700 mb-8 text-lg leading-relaxed">{product.description}</p>
            )}

            <div className="bg-gradient-to-br from-[#5f7ab8]/5 to-[#4a6199]/5 border-2 border-[#5f7ab8]/20 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Giá sản phẩm:</span>
                <span className="text-3xl font-bold text-[#5f7ab8]">{product.price || 'Liên hệ'}</span>
              </div>
            </div>

            {product.specifications && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-[#5f7ab8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Thông số kỹ thuật
                </h3>
                <div className="bg-gray-50 rounded-xl p-6 space-y-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 border-b border-gray-200 last:border-0">
                      <span className="text-gray-600 font-medium">{key}:</span>
                      <span className="font-semibold text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <a
                href="tel:+842838733686"
                className="block w-full bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white text-center px-6 py-3 rounded-xl text-sm font-bold hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Gọi ngay: +84 2838 733 686
              </a>
              <a
                href="mailto:info@newatlantic.vn"
                className="block w-full bg-white border-2 border-gray-200 text-gray-900 text-center px-6 py-3 rounded-xl text-sm font-bold hover:border-[#5f7ab8] hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Email: info@newatlantic.vn
              </a>
              <Link
                href="/lien-he"
                className="block w-full bg-white border-2 border-[#5f7ab8] text-[#5f7ab8] text-center px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#5f7ab8] hover:text-white transition-all"
              >
                Gửi yêu cầu tư vấn chi tiết
              </Link>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 mb-16 border border-gray-100">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <span className="bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] bg-clip-text text-transparent">
              Chi Tiết Sản Phẩm
            </span>
          </h2>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gradient-to-br from-[#5f7ab8]/5 to-white p-6 rounded-2xl border border-[#5f7ab8]/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#5f7ab8] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Chất Lượng Cao</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Sản phẩm chính hãng 100%, nhập khẩu trực tiếp từ nhà sản xuất {product.category}. 
                    Đảm bảo tiêu chuẩn chất lượng quốc tế.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#5f7ab8]/5 to-white p-6 rounded-2xl border border-[#5f7ab8]/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#5f7ab8] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Bảo Hành Dài Hạn</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Bảo hành chính hãng từ nhà sản xuất. Hỗ trợ kỹ thuật 24/7 
                    và bảo trì định kỳ miễn phí trong thời gian bảo hành.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#5f7ab8]/5 to-white p-6 rounded-2xl border border-[#5f7ab8]/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#5f7ab8] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Hiệu Suất Vượt Trội</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Thiết kế tối ưu cho hiệu suất làm việc cao, tiết kiệm năng lượng 
                    và độ bền vượt trội trong môi trường khắc nghiệt.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#5f7ab8]/5 to-white p-6 rounded-2xl border border-[#5f7ab8]/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#5f7ab8] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Hỗ Trợ Kỹ Thuật</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Đội ngũ kỹ thuật viên chuyên nghiệp, được đào tạo bài bản tại nhà máy. 
                    Sẵn sàng hỗ trợ và tư vấn mọi lúc mọi nơi.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-[#5f7ab8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Mô Tả Chi Tiết
            </h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>{product.name}</strong> là một trong những sản phẩm hàng đầu thuộc dòng {product.category}. 
                Được thiết kế và sản xuất với công nghệ tiên tiến nhất, sản phẩm đáp ứng mọi nhu cầu 
                khắt khe nhất trong các ngành công nghiệp, xây dựng và quốc phòng.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Với nhiều năm kinh nghiệm phân phối và hỗ trợ kỹ thuật, NEW ATLANTIC cam kết mang đến 
                cho quý khách hàng không chỉ là sản phẩm chất lượng mà còn là dịch vụ chuyên nghiệp, 
                tận tâm và đáng tin cậy.
              </p>
            </div>
          </div>

          {/* Applications */}
          <div className="bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] text-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Ứng Dụng
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl mb-2">🏗️</div>
                <h4 className="font-bold mb-2">Xây Dựng</h4>
                <p className="text-sm text-gray-100">Công trình dân dụng, công nghiệp</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl mb-2">🏭</div>
                <h4 className="font-bold mb-2">Công Nghiệp</h4>
                <p className="text-sm text-gray-100">Nhà máy, khu công nghiệp</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl mb-2">🛡️</div>
                <h4 className="font-bold mb-2">Quốc Phòng</h4>
                <p className="text-sm text-gray-100">An ninh, quân sự</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 relative">
            {/* Section Header with Decorative Elements */}
            <div className="text-center mb-12 relative">
              <div className="inline-block relative">
                <h2 className="text-4xl font-bold text-gray-900 mb-3 relative z-10">
                  Sản phẩm liên quan
                </h2>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] rounded-full"></div>
              </div>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                Khám phá thêm các sản phẩm chất lượng cao từ cùng danh mục
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <Link 
                  key={relatedProduct.id} 
                  href={`/san-pham/${relatedProduct.categorySlug}/${relatedProduct.slug}`}
                  className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:-translate-y-2"
                >
                  {/* Image Container with Overlay */}
                  <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {relatedProduct.image ? (
                      <>
                        <Image
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
                        <svg className="w-20 h-20 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    {/* Featured Badge */}
                    {relatedProduct.featured && (
                      <div className="absolute top-4 left-4 z-10">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Nổi bật
                        </div>
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                        {relatedProduct.category}
                      </div>
                    </div>

                    {/* Price Badge at bottom */}
                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg border border-white/50">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600 font-semibold">Giá:</span>
                          <span className="text-lg font-bold text-[#5f7ab8]">
                            {relatedProduct.price || 'Liên hệ'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-gray-900 line-clamp-2 mb-3 group-hover:text-[#5f7ab8] transition-colors leading-tight min-h-[3.5rem]">
                      {relatedProduct.name}
                    </h3>
                    
                    {relatedProduct.description && (
                      <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-4 min-h-[2.5rem]">
                        {relatedProduct.description}
                      </p>
                    )}

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4"></div>

                    {/* View Details Button */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-[#5f7ab8] font-bold text-sm group-hover:gap-3 transition-all">
                        Xem chi tiết
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                      
                      {/* Stock Status */}
                      <div className="flex items-center gap-1.5 text-green-600 text-xs font-semibold">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Còn hàng</span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 border-2 border-[#5f7ab8] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </Link>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-12">
              <Link 
                href={`/san-pham/${product.categorySlug}`}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
              >
                <span>Xem tất cả sản phẩm {product.category}</span>
                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
