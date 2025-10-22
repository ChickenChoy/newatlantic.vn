import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import PostCard from '@/components/PostCard';
import ScrollAnimation from '@/components/ScrollAnimation';
import HeroSlider from '@/components/HeroSlider';
import { products, posts } from '@/lib/data';
import { generateMetadata as genMeta, generateOrganizationSchema, generateWebSiteSchema, generateLocalBusinessSchema } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = genMeta({
  title: 'NEW ATLANTIC - Tân Đại Tây Dương | Thiết bị công nghiệp chính hãng',
  description: 'Nhà phân phối chính hãng WILL-BURT, HIAB, LOVOL, LIUGONG tại Việt Nam. Cung cấp cột tự nâng, cẩu tự hành HIAB, thiết bị nâng hạ, máy móc công trình chất lượng cao. Hơn 22 năm kinh nghiệm, hỗ trợ 24/7.',
  path: '/',
  keywords: [
    'NEW ATLANTIC',
    'Tân Đại Tây Dương',
    'WILL-BURT',
    'HIAB',
    'LOVOL',
    'LIUGONG',
    'cột tự nâng',
    'cẩu tự hành',
    'xe nâng Moffett',
    'máy đào',
    'thiết bị công nghiệp',
    'máy móc công trình',
    'thiết bị nâng hạ',
    'Clark Masts',
    'EFFER',
    'nhà phân phối chính hãng',
    'thiết bị xây dựng',
  ],
});

export default function HomePage() {
  const featuredProducts = products.filter(p => p.featured).slice(0, 3);
  const latestPosts = posts.slice(0, 3);

  // Generate JSON-LD structured data
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />

      {/* Hero Slider */}
      <HeroSlider />

      {/* Company Slogan Section */}
      <section className="py-12 md:py-16 bg-gray-50 relative overflow-hidden">
        {/* Modern Abstract Background */}
        <div className="absolute inset-0">
          {/* Gradient Orbs */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#5f7ab8]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#4a6199]/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%235f7ab8' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollAnimation direction="up">
            <div className="max-w-5xl mx-auto">
              {/* Slogan Card */}
              <div className="bg-gradient-to-br from-gray-50 via-gray-100/50 to-gray-50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/60 p-6 md:p-8 lg:p-10 relative overflow-hidden">
                {/* Accent Border Top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#5f7ab8] to-transparent"></div>
                
                {/* Decorative Corner Elements */}
                <div className="absolute top-8 left-8 w-20 h-20 border-t-2 border-l-2 border-[#5f7ab8]/20 rounded-tl-3xl"></div>
                <div className="absolute bottom-8 right-8 w-20 h-20 border-b-2 border-r-2 border-[#5f7ab8]/20 rounded-br-3xl"></div>
                
                {/* Content */}
                <div className="relative">

                  
                  {/* Slogan Text */}
                  <div className="text-center space-y-4">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
                      <span className="bg-gradient-to-r from-gray-700 via-[#5f7ab8] to-gray-700 bg-clip-text text-transparent">
                        PHÁT TRIỂN PHỒN VINH XÂY THỊNH VƯỢNG
                      </span>
                    </h2>
                    
                    {/* Divider */}
                    <div className="flex items-center justify-center gap-2 py-1">
                      <div className="w-10 h-px bg-gradient-to-r from-transparent to-[#5f7ab8]"></div>
                      <div className="w-1.5 h-1.5 bg-[#5f7ab8] rounded-full"></div>
                      <div className="w-10 h-px bg-gradient-to-l from-transparent to-[#5f7ab8]"></div>
                    </div>
                    
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
                      <span className="bg-gradient-to-r from-gray-700 via-[#5f7ab8] to-gray-700 bg-clip-text text-transparent">
                        TỰ HÀO BỐN CHỮ TÂN ĐẠI TÂY DƯƠNG
                      </span>
                    </h2>
                  </div>
                  
                  {/* Bottom Accent */}
                  <div className="flex justify-center mt-6">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-[#5f7ab8] rounded-full animate-pulse"></div>
                      <div className="w-1.5 h-1.5 bg-[#5f7ab8] rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-1.5 h-1.5 bg-[#5f7ab8] rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Company Overview - About Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-gray-100/50 relative overflow-hidden">
        {/* Background Elements - Simplified */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute w-96 h-96 bg-[#5f7ab8]/10 rounded-full blur-3xl top-20 -right-48"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
              <ScrollAnimation direction="left">
                <div className="space-y-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium mb-4 tracking-wide uppercase">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Về chúng tôi
                    </div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                      Hành trình phát triển
                      <span className="block text-[#5f7ab8]">
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
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-[#5f7ab8]/10 to-[#4a6199]/10 rounded-2xl md:rounded-3xl p-4 md:p-8">
                    <div className="bg-gray-50 rounded-xl md:rounded-2xl shadow-2xl h-full overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#5f7ab8]/5 to-transparent"></div>
                      <div className="relative z-10 p-4 md:p-8 h-full flex flex-col justify-center">
                      <div className="space-y-4 md:space-y-6">
                        <div className="flex items-start gap-3 md:gap-4">
                            <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                              <svg className="w-5 h-5 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-sm md:text-lg text-gray-900 mb-1 md:mb-2">Chất lượng đảm bảo</h4>
                              <p className="text-xs md:text-base text-gray-600 leading-relaxed">Sản phẩm chính hãng 100% từ nhà sản xuất</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 md:gap-4">
                            <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                              <svg className="w-5 h-5 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-sm md:text-lg text-gray-900 mb-1 md:mb-2">Giao hàng nhanh chóng</h4>
                              <p className="text-xs md:text-base text-gray-600 leading-relaxed">Vận chuyển toàn quốc trong 24-48h</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 md:gap-4">
                            <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                              <svg className="w-5 h-5 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-sm md:text-lg text-gray-900 mb-1 md:mb-2">Hỗ trợ chuyên nghiệp</h4>
                              <p className="text-xs md:text-base text-gray-600 leading-relaxed">Đội ngũ kỹ thuật 24/7 tận tâm</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Elements - Simplified */}
                  <div className="absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] rounded-xl flex items-center justify-center shadow-lg opacity-90">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </section>

      {/* Products & Services Detail Section */}
      <section className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <ScrollAnimation direction="up">
              <div className="text-center mb-12 md:mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100/80 text-amber-600 rounded-full text-xs font-medium mb-4 tracking-wide uppercase">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  Sản phẩm & Dịch vụ
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  Nhà phân phối hàng đầu
                  <span className="block text-[#5f7ab8]">các thương hiệu nổi tiếng</span>
                </h2>
                <p className="text-gray-600 text-sm md:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
                  <strong className="text-gray-900">Tân Đại Tây Dương</strong> là nhà phân phối hàng đầu tại Việt Nam cho các thương hiệu nổi tiếng thế giới như <strong className="text-[#5f7ab8]">WILL-BURT, HIAB, LOVOL, LIUGONG</strong>. Chúng tôi cung cấp sản phẩm và dịch vụ chính hãng.
                </p>
              </div>
            </ScrollAnimation>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {/* Service 1 - Cẩu tự hành */}
              <ScrollAnimation direction="left" delay={0}>
                <div className="bg-gray-100 rounded-2xl p-6 lg:p-8 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-[#5f7ab8]/30">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Cẩu tự hành</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Cẩu tự hành HIAB với nhiều tải trọng và kích thước khác nhau, phù hợp với mọi nhu cầu của khách hàng.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>

              {/* Service 2 - Thiết bị cơ giới */}
              <ScrollAnimation direction="right" delay={100}>
                <div className="bg-gray-100 rounded-2xl p-6 lg:p-8 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-[#5f7ab8]/30">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Thiết bị cơ giới</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        LOVOL, LIUGONG với chất lượng cao và giá cả cạnh tranh, đáp ứng mọi yêu cầu nâng hạ hàng hóa.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>

              {/* Service 3 - Phụ tùng */}
              <ScrollAnimation direction="left" delay={200}>
                <div className="bg-gray-100 rounded-2xl p-6 lg:p-8 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-[#5f7ab8]/30">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Phụ tùng thay thế</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Cung cấp đầy đủ phụ tùng thay thế chính hãng, đảm bảo chất lượng và độ bền cao.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>

              {/* Service 4 - Sửa chữa bảo trì */}
              <ScrollAnimation direction="right" delay={300}>
                <div className="bg-gray-100 rounded-2xl p-6 lg:p-8 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-[#5f7ab8]/30">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Sửa chữa & Bảo trì</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Đội ngũ kỹ thuật viên chuyên nghiệp, giàu kinh nghiệm, sẵn sàng hỗ trợ khách hàng 24/7.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            </div>

            {/* Commitment Box */}
            <ScrollAnimation direction="up" delay={400}>
              <div className="mt-12 bg-gradient-to-r from-[#5f7ab8]/5 via-[#5f7ab8]/10 to-[#5f7ab8]/5 rounded-2xl p-6 lg:p-8 border-l-4 border-[#5f7ab8]">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#5f7ab8] rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Cam kết của chúng tôi</h3>
                    <p className="text-gray-700 leading-relaxed">
                      <strong className="text-[#5f7ab8]">Tân Đại Tây Dương</strong> cam kết mang đến cho khách hàng những sản phẩm và dịch vụ <strong>chất lượng cao nhất</strong>, với <strong>giá cả cạnh tranh</strong> và <strong>dịch vụ hậu mãi chu đáo</strong>. Chúng tôi luôn nỗ lực để trở thành đối tác tin cậy của khách hàng trong mọi lĩnh vực.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Products & Brands Section */}
      <section className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
        {/* Background Pattern - Lighter */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #5f7ab8 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 md:mb-20">
              <ScrollAnimation direction="up">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium mb-4 tracking-wide uppercase">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  Sản phẩm & Thương hiệu
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                  Đối tác của các
                  <span className="block text-[#5f7ab8]">
                    thương hiệu hàng đầu
                  </span>
                </h2>
                <p className="text-gray-600 text-sm md:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
                  Nhà phân phối chính thức của <strong>WILL-BURT, HIAB, LOVOL, LIUGONG</strong> tại Việt Nam với cam kết chất lượng và dịch vụ tốt nhất
                </p>
              </ScrollAnimation>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {/* WILL-BURT Card */}
            <ScrollAnimation direction="left" delay={0}>
              <div className="group bg-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col border border-gray-200">
                <div className="h-40 sm:h-44 md:h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                  <img src="/images/box-image/will-burt.jpg" alt="WILL-BURT" className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-5 md:p-6 flex flex-col flex-grow">
                  <h3 className="font-bold text-base md:text-lg lg:text-xl text-gray-900 mb-2 md:mb-3">CỘT TỰ NÂNG WILL-BURT</h3>
                  <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-5 flex-grow leading-relaxed">
                    Cột tự nâng với hơn 100 năm lịch sử, chất lượng vượt trội cho quân sự, truyền thông và công nghiệp.
                  </p>
                  <Link href="/san-pham/cot-tu-nang-will-burt" className="inline-flex items-center gap-2 text-[#5f7ab8] font-semibold hover:gap-3 transition-all group-hover:text-[#4a6199] text-xs md:text-sm">
                    Khám phá ngay
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </ScrollAnimation>

            {/* HIAB Card */}
            <ScrollAnimation direction="left" delay={100}>
              <div className="group bg-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col border border-gray-200">
                <div className="h-40 sm:h-44 md:h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                  <img src="/images/box-image/hiab.jpg" alt="HIAB" className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-5 md:p-6 flex flex-col flex-grow">
                  <h3 className="font-bold text-base md:text-lg lg:text-xl text-gray-900 mb-2 md:mb-3">THIẾT BỊ NÂNG HIAB</h3>
                  <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-5 flex-grow leading-relaxed">
                    Cẩu tự hành, xe nâng Moffett đa dạng tải trọng, phù hợp mọi nhu cầu vận chuyển và xây dựng.
                  </p>
                  <Link href="/san-pham/thiet-bi-nang-ha-hiab" className="inline-flex items-center gap-2 text-[#5f7ab8] font-semibold hover:gap-3 transition-all group-hover:text-[#4a6199] text-xs md:text-sm">
                    Khám phá ngay
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </ScrollAnimation>

            {/* LOVOL Card */}
            <ScrollAnimation direction="right" delay={200}>
              <div className="group bg-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col border border-gray-200">
                <div className="h-40 sm:h-44 md:h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                  <img src="/images/box-image/lovol.jpg" alt="LOVOL" className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-5 md:p-6 flex flex-col flex-grow">
                  <h3 className="font-bold text-base md:text-lg lg:text-xl text-gray-900 mb-2 md:mb-3">THIẾT BỊ LOVOL</h3>
                  <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-5 flex-grow leading-relaxed">
                    Máy móc công trình: máy xúc, máy ủi, máy san với giá cạnh tranh, hiệu suất cao.
                  </p>
                  <Link href="/san-pham/thiet-bi-cong-trinh-lovol" className="inline-flex items-center gap-2 text-[#5f7ab8] font-semibold hover:gap-3 transition-all group-hover:text-[#4a6199] text-xs md:text-sm">
                    Khám phá ngay
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </ScrollAnimation>

            {/* LIUGONG Card */}
            <ScrollAnimation direction="right" delay={300}>
              <div className="group bg-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col border border-gray-200">
                <div className="h-40 sm:h-44 md:h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                  <img src="/images/box-image/liugong.jpg" alt="LIUGONG" className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-5 md:p-6 flex flex-col flex-grow">
                  <h3 className="font-bold text-base md:text-lg lg:text-xl text-gray-900 mb-2 md:mb-3">THIẾT BỊ LIUGONG</h3>
                  <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-5 flex-grow leading-relaxed">
                    Thiết bị cơ giới xây dựng chất lượng cao, độ bền vượt trội cho mọi công trình.
                  </p>
                  <Link href="/san-pham/thiet-bi-cong-trinh-liugong" className="inline-flex items-center gap-2 text-[#5f7ab8] font-semibold hover:gap-3 transition-all group-hover:text-[#4a6199] text-xs md:text-sm">
                    Khám phá ngay
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50/50 to-white relative overflow-hidden">
        {/* Background Elements - Simplified */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute w-[500px] h-[500px] bg-[#5f7ab8]/8 rounded-full blur-3xl -top-48 -left-48"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <ScrollAnimation direction="up">
              <div className="mb-16 md:mb-20 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-100/80 text-rose-600 rounded-full text-xs font-medium mb-4 tracking-wide uppercase">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  Dịch vụ chuyên nghiệp
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                  Giải pháp
                  <span className="block text-[#5f7ab8]">
                    toàn diện & chuyên nghiệp
                  </span>
                </h2>
                <p className="text-gray-600 text-sm md:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
                  Cung cấp dịch vụ tư vấn, thiết kế, cung ứng và bảo trì thiết bị công nghiệp chất lượng cao
                </p>
              </div>
            </ScrollAnimation>
          </div>
          
          {/* Main Services */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <ScrollAnimation direction="left" delay={0}>
              <div className="group bg-gray-50 rounded-2xl shadow-lg p-6 lg:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Thiết Bị PCCC</h3>
                <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                  Cung cấp và thi công hệ thống phòng cháy chữa cháy đạt tiêu chuẩn quốc tế, bảo vệ tài sản và tính mạng.
                </p>
                <ul className="space-y-2.5 text-sm text-gray-600">
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
              <div className="group bg-gray-50 rounded-2xl shadow-lg p-6 lg:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Thiết Bị Điện</h3>
                <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                  Cung ứng và tư vấn hệ thống điện công nghiệp, đảm bảo vận hành liên tục và an toàn tuyệt đối.
                </p>
                <ul className="space-y-2.5 text-sm text-gray-600">
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
              <div className="group bg-gray-50 rounded-2xl shadow-lg p-6 lg:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Thiết Bị Chuyên Ngành</h3>
                <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                  Cung cấp thiết bị chuyên dụng cho các ngành công nghiệp, xây dựng và quốc phòng với chất lượng hàng đầu.
                </p>
                <ul className="space-y-2.5 text-sm text-gray-600">
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
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-gray-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <ScrollAnimation direction="up">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 md:mb-16">
                <div className="mb-6 lg:mb-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-100/80 text-violet-600 rounded-full text-xs font-medium mb-4 tracking-wide uppercase">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    Sản phẩm nổi bật
                  </div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                    Sản phẩm nổi bật
                  </h2>
                  <p className="text-gray-600 text-sm md:text-base lg:text-lg max-w-2xl leading-relaxed">
                    Khám phá các sản phẩm chất lượng cao được tin dùng
                  </p>
                </div>
                <Link 
                  href="/san-pham" 
                  className="inline-flex items-center gap-2 text-[#5f7ab8] hover:text-[#4a6199] font-medium text-sm md:text-base group transition-colors duration-200"
                >
                  Xem tất cả sản phẩm
                  <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </ScrollAnimation>
          </div>
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
      <section className="py-20 md:py-28 bg-gradient-to-br from-[#5f7ab8] via-[#4a6199] to-[#3a4d7a] text-white relative overflow-hidden">
        {/* Modern Geometric Background */}
        <div className="absolute inset-0">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/10"></div>
          
          {/* Hexagon Pattern - Modern & Clean */}
          <div className="absolute inset-0 opacity-[0.15]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
          
          {/* Topography Pattern Layer */}
          <div className="absolute inset-0 opacity-[0.08]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}></div>
          
          {/* Subtle animated circles */}
          <div className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s'}}></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{animationDuration: '10s', animationDelay: '2s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Why Choose Us */}
          <div>
          <ScrollAnimation direction="up">
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold mb-6 border border-white/20">
                  <svg className="w-4 h-4 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  TẠI SAO CHỌN CHÚNG TÔI
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                  Tại Sao Chọn Chúng Tôi?
                </h3>
                <p className="text-lg text-gray-100 max-w-2xl mx-auto leading-relaxed">
                  Cam kết mang đến giá trị tốt nhất cho khách hàng với dịch vụ chuyên nghiệp và sản phẩm chất lượng cao
                </p>
            </div>
          </ScrollAnimation>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <ScrollAnimation direction="left" delay={0}>
                <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl h-full relative overflow-hidden">
                  {/* Card Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                  
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      <svg className="w-8 h-8 group-hover:text-yellow-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-lg md:text-xl font-bold mb-3 group-hover:text-yellow-100 transition-colors duration-300">
                      Sản Phẩm Chính Hãng
                    </h4>
                    <p className="text-sm text-gray-100 leading-relaxed group-hover:text-white transition-colors duration-300">
                      100% sản phẩm nhập khẩu trực tiếp từ nhà sản xuất, đầy đủ chứng nhận và giấy tờ xuất xứ
                    </p>
                    
                    {/* Decorative Element */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-white/30 rounded-full group-hover:bg-yellow-300 transition-colors duration-300"></div>
                  </div>
                </div>
            </ScrollAnimation>
              
            <ScrollAnimation direction="up" delay={150}>
                <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl h-full relative overflow-hidden">
                  {/* Card Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                  
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      <svg className="w-8 h-8 group-hover:text-blue-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h4 className="text-lg md:text-xl font-bold mb-3 group-hover:text-blue-100 transition-colors duration-300">
                      Bảo Hành Toàn Diện
                    </h4>
                    <p className="text-sm text-gray-100 leading-relaxed group-hover:text-white transition-colors duration-300">
                      Chế độ bảo hành chính hãng dài hạn, hỗ trợ kỹ thuật 24/7 với đội ngũ chuyên gia giàu kinh nghiệm
                    </p>
                    
                    {/* Decorative Element */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-white/30 rounded-full group-hover:bg-blue-300 transition-colors duration-300"></div>
                  </div>
                </div>
            </ScrollAnimation>
              
            <ScrollAnimation direction="right" delay={300}>
                <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl h-full relative overflow-hidden">
                  {/* Card Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                  
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      <svg className="w-8 h-8 group-hover:text-green-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h4 className="text-lg md:text-xl font-bold mb-3 group-hover:text-green-100 transition-colors duration-300">
                      Đội Ngũ Chuyên Nghiệp
                    </h4>
                    <p className="text-sm text-gray-100 leading-relaxed group-hover:text-white transition-colors duration-300">
                      Kỹ thuật viên được đào tạo bài bản tại nhà máy, tư vấn nhiệt tình và hỗ trợ tận nơi
                    </p>
                    
                    {/* Decorative Element */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-white/30 rounded-full group-hover:bg-green-300 transition-colors duration-300"></div>
                  </div>
                </div>
            </ScrollAnimation>
            </div>
          </div>
        </div>
      </section>



      {/* Partners Network */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <ScrollAnimation direction="up">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-100/80 text-rose-600 rounded-full text-xs font-medium mb-4 tracking-wide uppercase">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  Đối tác đa quốc gia
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                  Quan hệ đối tác
                </h2>
                <p className="text-gray-600 text-sm md:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
                  Nhờ vào sự hợp tác chặt chẽ và hiệu quả với các đối tác chiến lược tại các thị trường quan trọng như <strong>Bắc Mỹ, Châu Âu, Châu Á và Trung Đông</strong>, chúng tôi có khả năng cung cấp các giải pháp và dịch vụ tiên tiến, đáp ứng nhu cầu đa dạng của khách hàng toàn cầu.
                </p>
              </ScrollAnimation>
            </div>

            {/* Partners Grid */}
            <ScrollAnimation direction="up">
              <div className="max-w-6xl mx-auto">
                {/* First row - 4 logos */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-4 md:mb-6">
                  <div className="bg-gray-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 p-6 md:p-8 flex items-center justify-center aspect-[4/3]">
                    <img src="/images/partner/airbones.png" alt="ST Airborne Systems" className="w-full h-full object-contain" />
                  </div>
                  <div className="bg-gray-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 p-6 md:p-8 flex items-center justify-center aspect-[4/3]">
                    <img src="/images/partner/WillBurt.png" alt="Will-Burt" className="w-full h-full object-contain" />
                  </div>
                  <div className="bg-gray-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 p-6 md:p-8 flex items-center justify-center aspect-[4/3]">
                    <img src="/images/partner/eldis.png" alt="Eldis Radar Systems" className="w-full h-full object-contain" />
                  </div>
                  <div className="bg-gray-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 p-6 md:p-8 flex items-center justify-center aspect-[4/3]">
                    <img src="/images/partner/hiab.png" alt="HIAB" className="w-full h-full object-contain" />
                  </div>
                </div>
                
                {/* Second row - 3 logos centered */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
                  <div className="bg-gray-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 p-6 md:p-8 flex items-center justify-center aspect-[4/3]">
                    <img src="/images/partner/lovol.png" alt="Weichai Lovol" className="w-full h-full object-contain" />
                  </div>
                  <div className="bg-gray-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 p-6 md:p-8 flex items-center justify-center aspect-[4/3]">
                    <img src="/images/partner/LS.png" alt="LiuGong" className="w-full h-full object-contain" />
                  </div>
                  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 p-6 md:p-8 flex items-center justify-center aspect-[4/3] col-span-2 md:col-span-1">
                    <img src="/images/partner/petronas.png" alt="Petronas" className="w-full h-full object-contain" />
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-100/30 to-gray-50 relative overflow-hidden">
        {/* Background Elements - Simplified */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute w-[500px] h-[500px] bg-[#5f7ab8]/8 rounded-full blur-3xl top-20 -right-48"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <ScrollAnimation direction="up">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium mb-4 tracking-wide uppercase">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Hệ thống chi nhánh
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                  Phủ sóng{' '}
                  <span className="text-[#5f7ab8]">
                    toàn quốc
                  </span>
                </h2>
                <p className="text-gray-600 text-sm md:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
                  Với hệ thống chi nhánh từ Bắc vào Nam, chúng tôi luôn sẵn sàng phục vụ khách hàng mọi lúc, mọi nơi
                </p>
              </ScrollAnimation>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {/* HCM Office */}
              <ScrollAnimation direction="left" delay={0}>
                <div className="group bg-gray-50 rounded-2xl shadow-lg p-6 lg:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 h-full">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="inline-block px-3 py-1.5 bg-[#5f7ab8]/10 text-[#5f7ab8] rounded-full text-xs font-semibold mb-3">
                    TRỤ SỞ CHÍNH
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">TP. Hồ Chí Minh</h3>
                  <div className="space-y-3 mb-5">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#5f7ab8] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        A60 Phú Thuận, Phường Phú Thuận, Quận 7, TP. Hồ Chí Minh
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <a href="tel:+842838733686" className="inline-flex items-center gap-2 text-[#5f7ab8] hover:text-[#4a6199] font-semibold transition-colors text-sm">
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
                <div className="group bg-gray-50 rounded-2xl shadow-lg p-6 lg:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 h-full">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="inline-block px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold mb-3">
                    CHI NHÁNH MIỀN BẮC
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Hà Nội</h3>
                  <div className="space-y-3 mb-5">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#5f7ab8] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Số 85 Nguyễn Phong Sắc, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <a href="tel:+842838733686" className="inline-flex items-center gap-2 text-[#5f7ab8] hover:text-[#4a6199] font-semibold transition-colors text-sm">
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
                <div className="group bg-gray-50 rounded-2xl shadow-lg p-6 lg:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 h-full">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="inline-block px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold mb-3">
                    CHI NHÁNH MIỀN TRUNG
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Quảng Trị</h3>
                  <div className="space-y-3 mb-5">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#5f7ab8] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Xã Triệu Giang, Huyện Triệu Phong, Tỉnh Quảng Trị
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <a href="tel:+842838733686" className="inline-flex items-center gap-2 text-[#5f7ab8] hover:text-[#4a6199] font-semibold transition-colors text-sm">
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
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation direction="up">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 md:mb-16">
                <div className="mb-6 lg:mb-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-100/80 text-cyan-600 rounded-full text-xs font-medium mb-4 tracking-wide uppercase">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Tin Tức & Sự Kiện
                  </div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                    Cập nhật mới nhất
                  </h2>
                  <p className="text-gray-600 text-sm md:text-base lg:text-lg max-w-2xl leading-relaxed">
                    Thông tin về sản phẩm, công nghệ và các sự kiện quan trọng trong ngành
                  </p>
                </div>
                <Link 
                  href="/tin-tuc" 
                  className="inline-flex items-center gap-2 text-[#5f7ab8] hover:text-[#4a6199] font-medium text-sm md:text-base group transition-colors duration-200"
                >
                  Xem tất cả tin tức
                  <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </ScrollAnimation>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
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
