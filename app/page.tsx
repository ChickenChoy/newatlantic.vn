import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import PostCard from '@/components/PostCard';
import ScrollAnimation from '@/components/ScrollAnimation';
import FadeInAnimation from '@/components/FadeInAnimation';
import { products, posts } from '@/lib/data';

export default function HomePage() {
  const featuredProducts = products.filter(p => p.featured).slice(0, 3);
  const latestPosts = posts.slice(0, 3);

  return (
    <>
      {/* Hero Section - Modern Design */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-[#5f7ab8] via-[#4a6199] to-[#3a4d7a] overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 py-24 md:py-40 lg:py-48 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20 items-center">
            {/* Hero Content */}
            <FadeInAnimation direction="left" delay={200}>
              <div className="text-white">
                <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8 mt-10 md:mb-6 border border-white/20">
                  <span className="text-xs md:text-sm lg:text-base font-medium">🏆 Nhà phân phối chính thức tại Việt Nam</span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 lg:mb-8 leading-tight">
                  Thiết Bị Công Nghiệp
                  <span className="block bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                    Chất Lượng Hàng Đầu
                  </span>
                </h1>
                <p className="text-sm md:text-base lg:text-xl xl:text-2xl mb-6 md:mb-8 lg:mb-10 text-gray-100 leading-relaxed">
                  Đại diện phân phối độc quyền các thương hiệu WILL-BURT, HIAB, LOVOL, LIUGONG 
                  với cam kết chất lượng và dịch vụ tốt nhất
                </p>
                <div className="flex flex-wrap gap-3 md:gap-4 lg:gap-5">
                  <Link
                    href="/san-pham"
                    className="bg-white text-[#5f7ab8] px-5 md:px-6 lg:px-8 py-2.5 md:py-3 lg:py-4 rounded-xl text-xs md:text-sm lg:text-base font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
                  >
                    Khám phá sản phẩm
                  </Link>
                  <Link
                    href="/lien-he"
                    className="bg-transparent border-2 border-white text-white px-5 md:px-6 lg:px-8 py-2.5 md:py-3 lg:py-4 rounded-xl text-xs md:text-sm lg:text-base font-bold hover:bg-white hover:text-[#5f7ab8] transition-all"
                  >
                    Liên hệ tư vấn
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 md:gap-6 lg:gap-8 mt-6 md:mt-12 lg:mt-16 pt-6 md:pt-12 lg:pt-16 border-t border-white/20">
                  <div>
                    <div className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-1 lg:mb-2">22+</div>
                    <div className="text-xs md:text-sm lg:text-base text-gray-200">Năm kinh nghiệm</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-1 lg:mb-2">50000+</div>
                    <div className="text-xs md:text-sm lg:text-base text-gray-200">Khách hàng</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-1 lg:mb-2">100%</div>
                    <div className="text-xs md:text-sm lg:text-base text-gray-200">Chính hãng</div>
                  </div>
                </div>
              </div>
            </FadeInAnimation>

            {/* Hero Image/Visual */}
            <FadeInAnimation direction="right" delay={400}>
              <div className="relative mt-8 lg:mt-0">
              <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl p-3 md:p-6 lg:p-10 xl:p-12 border border-white/20 shadow-2xl">
                <div className="grid grid-cols-2 gap-2 md:gap-3 lg:gap-5 xl:gap-6 items-stretch">
                  {/* WILL-BURT Card */}
                  <Link href="/san-pham/cot-tu-nang-will-burt" className="group">
                    <div className="relative bg-gradient-to-br from-white/20 to-white/5 rounded-xl md:rounded-2xl lg:rounded-3xl p-4 md:p-6 lg:p-8 xl:p-10 backdrop-blur-sm border border-white/20 flex flex-col items-center justify-center h-full min-h-[140px] md:min-h-[180px] lg:min-h-[240px] xl:min-h-[280px] overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-white/40 hover:from-white/30 hover:to-white/10">
                      {/* Background glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#5f7ab8]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative z-10 text-center flex flex-col items-center">
                        <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 xl:w-32 xl:h-32 mb-3 md:mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300">
                          <Image
                            src="/images/place-holder/placeholder.jpg"
                            alt="WILL-BURT"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="text-base md:text-lg lg:text-2xl xl:text-3xl font-bold mb-1 md:mb-2 group-hover:text-white transition-colors">WILL-BURT</div>
                        <div className="text-xs md:text-sm lg:text-base xl:text-lg text-gray-200 group-hover:text-white transition-colors">Cột tự nâng</div>
                      </div>
                      
                      {/* Arrow indicator */}
                      <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 lg:bottom-5 lg:right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </Link>

                  {/* HIAB Card */}
                  <Link href="/san-pham/thiet-bi-nang-ha-hiab" className="group">
                    <div className="relative bg-gradient-to-br from-white/20 to-white/5 rounded-xl md:rounded-2xl lg:rounded-3xl p-4 md:p-6 lg:p-8 xl:p-10 backdrop-blur-sm border border-white/20 flex flex-col items-center justify-center h-full min-h-[140px] md:min-h-[180px] lg:min-h-[240px] xl:min-h-[280px] overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-white/40 hover:from-white/30 hover:to-white/10">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#5f7ab8]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative z-10 text-center flex flex-col items-center">
                        <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 xl:w-32 xl:h-32 mb-3 md:mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300">
                          <Image
                            src="/images/place-holder/placeholder.jpg"
                            alt="HIAB"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="text-base md:text-lg lg:text-2xl xl:text-3xl font-bold mb-1 md:mb-2 group-hover:text-white transition-colors">HIAB</div>
                        <div className="text-xs md:text-sm lg:text-base xl:text-lg text-gray-200 group-hover:text-white transition-colors">Cẩu & xe nâng</div>
                      </div>
                      
                      <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 lg:bottom-5 lg:right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </Link>

                  {/* LOVOL Card */}
                  <Link href="/san-pham/thiet-bi-cong-trinh-lovol" className="group">
                    <div className="relative bg-gradient-to-br from-white/20 to-white/5 rounded-xl md:rounded-2xl lg:rounded-3xl p-4 md:p-6 lg:p-8 xl:p-10 backdrop-blur-sm border border-white/20 flex flex-col items-center justify-center h-full min-h-[140px] md:min-h-[180px] lg:min-h-[240px] xl:min-h-[280px] overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-white/40 hover:from-white/30 hover:to-white/10">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#5f7ab8]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative z-10 text-center flex flex-col items-center">
                        <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 xl:w-32 xl:h-32 mb-3 md:mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300">
                          <Image
                            src="/images/place-holder/placeholder.jpg"
                            alt="LOVOL"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="text-base md:text-lg lg:text-2xl xl:text-3xl font-bold mb-1 md:mb-2 group-hover:text-white transition-colors">LOVOL</div>
                        <div className="text-xs md:text-sm lg:text-base xl:text-lg text-gray-200 group-hover:text-white transition-colors">Máy móc công trình</div>
                      </div>
                      
                      <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 lg:bottom-5 lg:right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </Link>

                  {/* LIUGONG Card */}
                  <Link href="/san-pham/thiet-bi-cong-trinh-liugong" className="group">
                    <div className="relative bg-gradient-to-br from-white/20 to-white/5 rounded-xl md:rounded-2xl lg:rounded-3xl p-4 md:p-6 lg:p-8 xl:p-10 backdrop-blur-sm border border-white/20 flex flex-col items-center justify-center h-full min-h-[140px] md:min-h-[180px] lg:min-h-[240px] xl:min-h-[280px] overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-white/40 hover:from-white/30 hover:to-white/10">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#5f7ab8]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative z-10 text-center flex flex-col items-center">
                        <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 xl:w-32 xl:h-32 mb-3 md:mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300">
                          <Image
                            src="/images/place-holder/placeholder.jpg"
                            alt="LIUGONG"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="text-base md:text-lg lg:text-2xl xl:text-3xl font-bold mb-1 md:mb-2 group-hover:text-white transition-colors">LIUGONG</div>
                        <div className="text-xs md:text-sm lg:text-base xl:text-lg text-gray-200 group-hover:text-white transition-colors">Thiết bị xây dựng</div>
                      </div>
                      
                      <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 lg:bottom-5 lg:right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              {/* Decorative circles */}
              <div className="absolute -z-10 w-72 h-72 bg-white/10 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
              <div className="absolute -z-10 w-96 h-96 bg-[#5f7ab8]/10 rounded-full blur-3xl top-0 right-0"></div>
            </div>
            </FadeInAnimation>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Trusted Partners */}
      <section className="py-12 md:py-16 bg-white border-b">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="up">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Đối Tác Toàn Cầu</h2>
              <p className="text-sm md:text-base text-gray-600">Phân phối độc quyền các thương hiệu hàng đầu thế giới</p>
            </div>
          </ScrollAnimation>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 items-stretch">
            {['WILL-BURT', 'HIAB', 'LOVOL', 'LIUGONG'].map((brand, index) => (
              <ScrollAnimation 
                key={brand} 
                direction={index % 2 === 0 ? 'left' : 'right'}
                delay={index * 100}
              >
                <div className="group h-full">
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 md:p-8 hover:shadow-xl transition-all border border-gray-100 group-hover:border-[#5f7ab8] h-full flex items-center justify-center">
                    <h3 className="text-lg md:text-xl font-bold text-center text-gray-700 group-hover:text-[#5f7ab8] transition-colors">
                      {brand}
                    </h3>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12">
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3">Sản Phẩm Nổi Bật</h2>
                <p className="text-sm md:text-base lg:text-lg text-gray-600">Khám phá các sản phẩm chất lượng cao được tin dùng</p>
              </div>
              <Link 
                href="/san-pham" 
                className="mt-4 md:mt-0 inline-flex items-center gap-2 text-[#5f7ab8] hover:text-[#4a6199] font-semibold group"
              >
                Xem tất cả
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </ScrollAnimation>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {featuredProducts.map((product, index) => (
              <ScrollAnimation 
                key={product.id}
                direction={index % 2 === 0 ? 'left' : 'right'}
                delay={index * 150}
              >
                <ProductCard product={product} />
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl top-0 right-0"></div>
          <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl bottom-0 left-0"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <ScrollAnimation direction="up">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-3">Tại Sao Chọn Chúng Tôi?</h2>
              <p className="text-xl text-gray-100">Cam kết mang đến giá trị tốt nhất cho khách hàng</p>
            </div>
          </ScrollAnimation>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            <ScrollAnimation direction="left" delay={0}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all flex flex-col h-full">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Sản Phẩm Chính Hãng</h3>
                <p className="text-gray-100 leading-relaxed">
                  100% sản phẩm nhập khẩu trực tiếp từ nhà sản xuất, đầy đủ chứng nhận và giấy tờ xuất xứ
                </p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation direction="up" delay={150}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all flex flex-col h-full">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Bảo Hành Toàn Diện</h3>
                <p className="text-gray-100 leading-relaxed">
                  Chế độ bảo hành chính hãng dài hạn, hỗ trợ kỹ thuật 24/7 với đội ngũ chuyên gia giàu kinh nghiệm
                </p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation direction="right" delay={300}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all flex flex-col h-full">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Đội Ngũ Chuyên Nghiệp</h3>
                <p className="text-gray-100 leading-relaxed">
                  Kỹ thuật viên được đào tạo bài bản tại nhà máy, tư vấn nhiệt tình và hỗ trợ tận nơi
                </p>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
              <div>
                <h2 className="text-4xl font-bold mb-3">Tin Tức & Sự Kiện</h2>
                <p className="text-gray-600 text-lg">Cập nhật thông tin mới nhất về sản phẩm và công nghệ</p>
              </div>
              <Link 
                href="/tin-tuc" 
                className="mt-4 md:mt-0 inline-flex items-center gap-2 text-[#5f7ab8] hover:text-[#4a6199] font-semibold group"
              >
                Xem tất cả
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </ScrollAnimation>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {latestPosts.map((post, index) => (
              <ScrollAnimation 
                key={post.id}
                direction={index % 2 === 0 ? 'left' : 'right'}
                delay={index * 150}
              >
                <PostCard post={post} />
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="up">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Sẵn Sàng Bắt Đầu Dự Án Của Bạn?
              </h2>
              <p className="text-xl text-gray-300 mb-10">
                Liên hệ với chúng tôi ngay hôm nay để nhận tư vấn miễn phí từ đội ngũ chuyên gia
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+842838733686"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white px-6 py-3 rounded-xl text-sm font-bold hover:shadow-2xl hover:scale-105 transition-all"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Gọi ngay: +84 2838 733 686
          </a>
          <a
                  href="mailto:info@newatlantic.vn"
                  className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Email: info@newatlantic.vn
                </a>
              </div>
            </div>
          </ScrollAnimation>
    </div>
      </section>
    </>
  );
}
