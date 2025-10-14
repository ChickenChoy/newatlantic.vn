import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import PostCard from '@/components/PostCard';
import ScrollAnimation from '@/components/ScrollAnimation';
import HeroSlider from '@/components/HeroSlider';
import { products, posts } from '@/lib/data';

export default function HomePage() {
  const featuredProducts = products.filter(p => p.featured).slice(0, 3);
  const latestPosts = posts.slice(0, 3);

  return (
    <>
      {/* Hero Slider */}
      <HeroSlider />

      {/* Company Overview - About Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute w-72 h-72 bg-[#5f7ab8]/5 rounded-full blur-3xl top-10 -right-36"></div>
          <div className="absolute w-96 h-96 bg-[#5f7ab8]/3 rounded-full blur-3xl -bottom-48 -left-48"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <ScrollAnimation direction="left">
                <div className="space-y-8">
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#5f7ab8]/10 text-[#5f7ab8] rounded-full text-sm font-semibold mb-6">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      VỀ CHÚNG TÔI
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                      Hành trình phát triển
                      <span className="block bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] bg-clip-text text-transparent">
                        từ 2003
                      </span>
                    </h2>
                  </div>
                  
                  <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                    <p>
                      <strong className="text-gray-900">Công ty Cổ phần Thương mại Quốc tế Tân Đại Tây Dương</strong> thành lập ngày 14/05/2003, với nỗ lực không ngừng đã phát triển từ một doanh nghiệp nhỏ thành một công ty uy tín trong và ngoài nước.
                    </p>
                    <p>
                      Với doanh thu nhiều năm nằm trong <strong className="text-[#5f7ab8]">top 5 doanh nghiệp lớn nhất tại Quận 7, TP. Hồ Chí Minh</strong>, chúng tôi tự hào là đối tác tin cậy của các thương hiệu hàng đầu thế giới.
                    </p>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-[#5f7ab8] mb-1">22+</div>
                      <div className="text-sm text-gray-600">Năm kinh nghiệm</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-[#5f7ab8] mb-1">4</div>
                      <div className="text-sm text-gray-600">Thương hiệu</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-[#5f7ab8] mb-1">1000+</div>
                      <div className="text-sm text-gray-600">Khách hàng</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-[#5f7ab8] mb-1">24/7</div>
                      <div className="text-sm text-gray-600">Hỗ trợ</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      href="/san-pham"
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Khám phá sản phẩm
                    </Link>
                    <Link 
                      href="/lien-he"
                      className="inline-flex items-center justify-center gap-2 border-2 border-[#5f7ab8] text-[#5f7ab8] px-8 py-4 rounded-xl font-semibold hover:bg-[#5f7ab8] hover:text-white transition-all duration-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Liên hệ tư vấn
                    </Link>
                  </div>
                </div>
              </ScrollAnimation>
              
              <ScrollAnimation direction="right">
                <div className="relative">
                  {/* Main Image Container */}
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-[#5f7ab8]/10 to-[#4a6199]/10 rounded-3xl p-6 md:p-8">
                    <div className="bg-white rounded-2xl shadow-2xl h-full overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#5f7ab8]/5 to-transparent"></div>
                      <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-center">
                        <div className="space-y-6">
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-bold text-lg text-gray-900 mb-2">Chất lượng đảm bảo</h4>
                              <p className="text-gray-600">Sản phẩm chính hãng 100% từ nhà sản xuất</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-bold text-lg text-gray-900 mb-2">Giao hàng nhanh chóng</h4>
                              <p className="text-gray-600">Vận chuyển toàn quốc trong 24-48h</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-bold text-lg text-gray-900 mb-2">Hỗ trợ chuyên nghiệp</h4>
                              <p className="text-gray-600">Đội ngũ kỹ thuật 24/7 tận tâm</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] rounded-2xl flex items-center justify-center shadow-xl">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] rounded-lg"></div>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </section>

      {/* Products & Brands Section */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #5f7ab8 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <ScrollAnimation direction="up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#5f7ab8]/10 text-[#5f7ab8] rounded-full text-sm font-semibold mb-6">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                SẢN PHẨM & THƯƠNG HIỆU
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Đối tác của các
                <span className="block bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] bg-clip-text text-transparent">
                  thương hiệu hàng đầu
                </span>
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
                Nhà phân phối chính thức của <strong>WILL-BURT, HIAB, LOVOL, LIUGONG</strong> tại Việt Nam với cam kết chất lượng và dịch vụ tốt nhất
              </p>
            </ScrollAnimation>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* WILL-BURT Card */}
            <ScrollAnimation direction="left" delay={0}>
              <div className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 h-full flex flex-col border border-gray-100">
                <div className="h-56 bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="relative z-10 text-white text-center p-6">
                    <div className="text-4xl lg:text-5xl font-bold mb-3 group-hover:scale-110 transition-transform duration-300">WILL-BURT</div>
                    <div className="text-sm opacity-90 bg-white/20 px-3 py-1 rounded-full">USA - 1918</div>
                  </div>
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="p-6 lg:p-8 flex flex-col flex-grow">
                  <h3 className="font-bold text-xl lg:text-2xl text-gray-900 mb-4">CỘT TỰ NÂNG WILL-BURT</h3>
                  <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                    Cột tự nâng với hơn 100 năm lịch sử, chất lượng vượt trội cho quân sự, truyền thông và công nghiệp.
                  </p>
                  <Link href="/san-pham/cot-tu-nang-will-burt" className="inline-flex items-center gap-2 text-[#5f7ab8] font-semibold hover:gap-3 transition-all group-hover:text-[#4a6199]">
                    Khám phá ngay
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </ScrollAnimation>

            {/* HIAB Card */}
            <ScrollAnimation direction="left" delay={100}>
              <div className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 h-full flex flex-col border border-gray-100">
                <div className="h-56 bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="relative z-10 text-white text-center p-6">
                    <div className="text-4xl lg:text-5xl font-bold mb-3 group-hover:scale-110 transition-transform duration-300">HIAB</div>
                    <div className="text-sm opacity-90 bg-white/20 px-3 py-1 rounded-full">SWEDEN - 1944</div>
                  </div>
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </div>
                </div>
                <div className="p-6 lg:p-8 flex flex-col flex-grow">
                  <h3 className="font-bold text-xl lg:text-2xl text-gray-900 mb-4">THIẾT BỊ NÂNG HIAB</h3>
                  <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                    Cẩu tự hành, xe nâng Moffett đa dạng tải trọng, phù hợp mọi nhu cầu vận chuyển và xây dựng.
                  </p>
                  <Link href="/san-pham/thiet-bi-nang-ha-hiab" className="inline-flex items-center gap-2 text-[#5f7ab8] font-semibold hover:gap-3 transition-all group-hover:text-[#4a6199]">
                    Khám phá ngay
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </ScrollAnimation>

            {/* LOVOL Card */}
            <ScrollAnimation direction="right" delay={200}>
              <div className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 h-full flex flex-col border border-gray-100">
                <div className="h-56 bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="relative z-10 text-white text-center p-6">
                    <div className="text-4xl lg:text-5xl font-bold mb-3 group-hover:scale-110 transition-transform duration-300">LOVOL</div>
                    <div className="text-sm opacity-90 bg-white/20 px-3 py-1 rounded-full">CHINA - 1998</div>
                  </div>
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="p-6 lg:p-8 flex flex-col flex-grow">
                  <h3 className="font-bold text-xl lg:text-2xl text-gray-900 mb-4">THIẾT BỊ LOVOL</h3>
                  <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                    Máy móc công trình: máy xúc, máy ủi, máy san với giá cạnh tranh, hiệu suất cao.
                  </p>
                  <Link href="/san-pham/thiet-bi-cong-trinh-lovol" className="inline-flex items-center gap-2 text-[#5f7ab8] font-semibold hover:gap-3 transition-all group-hover:text-[#4a6199]">
                    Khám phá ngay
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </ScrollAnimation>

            {/* LIUGONG Card */}
            <ScrollAnimation direction="right" delay={300}>
              <div className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 h-full flex flex-col border border-gray-100">
                <div className="h-56 bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="relative z-10 text-white text-center p-6">
                    <div className="text-4xl lg:text-5xl font-bold mb-3 group-hover:scale-110 transition-transform duration-300">LIUGONG</div>
                    <div className="text-sm opacity-90 bg-white/20 px-3 py-1 rounded-full">CHINA - 1958</div>
                  </div>
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="p-6 lg:p-8 flex flex-col flex-grow">
                  <h3 className="font-bold text-xl lg:text-2xl text-gray-900 mb-4">THIẾT BỊ LIUGONG</h3>
                  <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                    Thiết bị cơ giới xây dựng chất lượng cao, độ bền vượt trội cho mọi công trình.
                  </p>
                  <Link href="/san-pham/thiet-bi-cong-trinh-liugong" className="inline-flex items-center gap-2 text-[#5f7ab8] font-semibold hover:gap-3 transition-all group-hover:text-[#4a6199]">
                    Khám phá ngay
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-[#5f7ab8]/5 rounded-full blur-3xl -top-48 -left-48"></div>
          <div className="absolute w-72 h-72 bg-[#5f7ab8]/3 rounded-full blur-3xl top-1/2 -right-36"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <ScrollAnimation direction="up">
            <div className="mb-16 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#5f7ab8]/10 text-[#5f7ab8] rounded-full text-sm font-semibold mb-6">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                DỊCH VỤ CHUYÊN NGHIỆP
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Giải pháp
                <span className="block bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] bg-clip-text text-transparent">
                  toàn diện & chuyên nghiệp
                </span>
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
                Cung cấp dịch vụ tư vấn, thiết kế, cung ứng và bảo trì thiết bị công nghiệp chất lượng cao
              </p>
            </div>
          </ScrollAnimation>
          
          {/* Main Services */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <ScrollAnimation direction="left" delay={0}>
              <div className="group bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Thiết Bị PCCC</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Cung cấp và thi công hệ thống phòng cháy chữa cháy đạt tiêu chuẩn quốc tế, bảo vệ tài sản và tính mạng.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Cung ứng vật tư PCCC chính hãng
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Tư vấn thiết kế hệ thống PCCC
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Thi công lắp đặt chuyên nghiệp
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Bảo trì bảo dưỡng định kỳ
                  </li>
                </ul>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={150}>
              <div className="group bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Thiết Bị Điện</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Cung ứng và tư vấn hệ thống điện công nghiệp, đảm bảo vận hành liên tục và an toàn tuyệt đối.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    Cung ứng thiết bị điện chất lượng
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    Tư vấn thi công mạng lưới điện
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    Lắp đặt hệ thống điện an toàn
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    Bảo trì vận hành 24/7
                  </li>
                </ul>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="right" delay={300}>
              <div className="group bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Thiết Bị Chuyên Ngành</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Cung cấp thiết bị chuyên dụng cho các ngành công nghiệp, xây dựng và quốc phòng với chất lượng hàng đầu.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#5f7ab8] rounded-full"></div>
                    Cẩu tự hành HIAB đa tải trọng
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#5f7ab8] rounded-full"></div>
                    Máy móc LOVOL, LIUGONG
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#5f7ab8] rounded-full"></div>
                    Cột tự nâng WILL-BURT
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#5f7ab8] rounded-full"></div>
                    Xe nâng Moffett chuyên nghiệp
                  </li>
                </ul>
              </div>
            </ScrollAnimation>
          </div>

          {/* Additional Services Grid */}
          <ScrollAnimation direction="up">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
              <div className="text-center mb-12">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">Dịch Vụ Bổ Sung</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">Các dịch vụ khác để đáp ứng mọi nhu cầu của khách hàng</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2 text-gray-900">Cẩu Tự Hành</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Cho thuê cẩu tự hành HIAB đa dạng tải trọng
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2 text-gray-900">Phụ Tùng Chính Hãng</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Phụ tùng thay thế cho tất cả thiết bị
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2 text-gray-900">Giải Pháp An Ninh</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Hệ thống chống UAV và giám sát biển
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2 text-gray-900">Dầu Nhớt Petronas</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Dầu nhớt chất lượng cao cho máy móc
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2 text-gray-900">Lốp Xe & Acquy</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Lốp xe và bình acquy chính hãng
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2 text-gray-900">Hỗ Trợ Kỹ Thuật</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Tư vấn và hỗ trợ kỹ thuật 24/7
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-20 bg-gray-50">
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

      {/* Statistics Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#5f7ab8] via-[#4a6199] to-[#3a4d7a] text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl top-0 right-0 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl bottom-0 left-0 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '50px 50px'
            }}></div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Why Choose Us */}
          <div>
            <ScrollAnimation direction="up">
              <div className="text-center mb-12">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Tại Sao Chọn Chúng Tôi?</h3>
                <p className="text-lg text-gray-100 max-w-2xl mx-auto">Cam kết mang đến giá trị tốt nhất cho khách hàng</p>
              </div>
            </ScrollAnimation>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ScrollAnimation direction="left" delay={0}>
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:-translate-y-2 h-full">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-xl md:text-2xl font-bold mb-4">Sản Phẩm Chính Hãng</h4>
                  <p className="text-gray-100 leading-relaxed">
                    100% sản phẩm nhập khẩu trực tiếp từ nhà sản xuất, đầy đủ chứng nhận và giấy tờ xuất xứ
                  </p>
                </div>
              </ScrollAnimation>
              
              <ScrollAnimation direction="up" delay={150}>
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:-translate-y-2 h-full">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="text-xl md:text-2xl font-bold mb-4">Bảo Hành Toàn Diện</h4>
                  <p className="text-gray-100 leading-relaxed">
                    Chế độ bảo hành chính hãng dài hạn, hỗ trợ kỹ thuật 24/7 với đội ngũ chuyên gia giàu kinh nghiệm
                  </p>
                </div>
              </ScrollAnimation>
              
              <ScrollAnimation direction="right" delay={300}>
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:-translate-y-2 h-full">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="text-xl md:text-2xl font-bold mb-4">Đội Ngũ Chuyên Nghiệp</h4>
                  <p className="text-gray-100 leading-relaxed">
                    Kỹ thuật viên được đào tạo bài bản tại nhà máy, tư vấn nhiệt tình và hỗ trợ tận nơi
                  </p>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </section>



      {/* Global Network */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <ScrollAnimation direction="up">
                <div className="inline-block px-4 py-1 bg-[#5f7ab8]/10 text-[#5f7ab8] rounded-full text-sm font-semibold mb-4">
                  MẠNG LƯỚI TOÀN CẦU
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Đối tác quốc tế
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  Hợp tác chặt chẽ với các đối tác chiến lược tại <strong>Bắc Mỹ, Châu Âu, Châu Á và Trung Đông</strong>, 
                  cung cấp giải pháp tiên tiến đáp ứng nhu cầu đa dạng của khách hàng toàn cầu.
                </p>
              </ScrollAnimation>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <ScrollAnimation direction="left" delay={0}>
                <div className="text-center p-6 bg-white rounded-xl hover:bg-[#5f7ab8]/10 transition-colors shadow-md h-full flex flex-col items-center justify-center">
                  <div className="text-4xl mb-3">🇺🇸</div>
                  <div className="font-bold text-gray-900">Bắc Mỹ</div>
                </div>
              </ScrollAnimation>
              <ScrollAnimation direction="left" delay={100}>
                <div className="text-center p-6 bg-white rounded-xl hover:bg-[#5f7ab8]/10 transition-colors shadow-md h-full flex flex-col items-center justify-center">
                  <div className="text-4xl mb-3">🇪🇺</div>
                  <div className="font-bold text-gray-900">Châu Âu</div>
                </div>
              </ScrollAnimation>
              <ScrollAnimation direction="right" delay={200}>
                <div className="text-center p-6 bg-white rounded-xl hover:bg-[#5f7ab8]/10 transition-colors shadow-md h-full flex flex-col items-center justify-center">
                  <div className="text-4xl mb-3">🌏</div>
                  <div className="font-bold text-gray-900">Châu Á</div>
                </div>
              </ScrollAnimation>
              <ScrollAnimation direction="right" delay={300}>
                <div className="text-center p-6 bg-white rounded-xl hover:bg-[#5f7ab8]/10 transition-colors shadow-md h-full flex flex-col items-center justify-center">
                  <div className="text-4xl mb-3">🕌</div>
                  <div className="font-bold text-gray-900">Trung Đông</div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute w-72 h-72 bg-[#5f7ab8]/5 rounded-full blur-3xl top-20 -left-36"></div>
          <div className="absolute w-96 h-96 bg-[#5f7ab8]/3 rounded-full blur-3xl -bottom-48 -right-48"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <ScrollAnimation direction="up">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#5f7ab8]/10 text-[#5f7ab8] rounded-full text-sm font-semibold mb-6">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  HỆ THỐNG CHI NHÁNH
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  Phủ sóng{' '}
                  <span className="bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] bg-clip-text text-transparent">
                    toàn quốc
                  </span>
                </h2>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
                  Với hệ thống chi nhánh từ Bắc vào Nam, chúng tôi luôn sẵn sàng phục vụ khách hàng mọi lúc, mọi nơi
                </p>
              </ScrollAnimation>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {/* HCM Office */}
              <ScrollAnimation direction="left" delay={0}>
                <div className="group bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="inline-block px-3 py-1 bg-[#5f7ab8]/10 text-[#5f7ab8] rounded-full text-xs font-semibold mb-4">
                    TRỤ SỞ CHÍNH
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">TP. Hồ Chí Minh</h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#5f7ab8] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-gray-600 leading-relaxed">
                        A60 Phú Thuận, Phường Phú Thuận, Quận 7, TP. Hồ Chí Minh
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <a href="tel:+842838733686" className="inline-flex items-center gap-2 text-[#5f7ab8] hover:text-[#4a6199] font-semibold transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      +84 2838 733 686
                    </a>
                  </div>
                </div>
              </ScrollAnimation>

              {/* Hanoi Office */}
              <ScrollAnimation direction="up" delay={150}>
                <div className="group bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold mb-4">
                    CHI NHÁNH MIỀN BẮC
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Hà Nội</h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#5f7ab8] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-gray-600 leading-relaxed">
                        Số 85 Nguyễn Phong Sắc, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <a href="tel:+842838733686" className="inline-flex items-center gap-2 text-[#5f7ab8] hover:text-[#4a6199] font-semibold transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      +84 2838 733 686
                    </a>
                  </div>
                </div>
              </ScrollAnimation>

              {/* Quang Tri Office */}
              <ScrollAnimation direction="right" delay={300}>
                <div className="group bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold mb-4">
                    CHI NHÁNH MIỀN TRUNG
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Quảng Trị</h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#5f7ab8] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-gray-600 leading-relaxed">
                        Xã Triệu Giang, Huyện Triệu Phong, Tỉnh Quảng Trị
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <a href="tel:+842838733686" className="inline-flex items-center gap-2 text-[#5f7ab8] hover:text-[#4a6199] font-semibold transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      +84 2838 733 686
                    </a>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
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
      
 

    </>
  );
}
