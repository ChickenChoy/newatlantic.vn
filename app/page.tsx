import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import PostCard from '@/components/PostCard';
import ScrollAnimation from '@/components/ScrollAnimation';
import HeroSlider from '@/components/HeroSlider';
import LazyVideoBackground from '@/components/LazyVideoBackground';
import Testimonials from '@/components/Testimonials';
import FAQs from '@/components/FAQs';
import Certifications from '@/components/Certifications';
import GoogleMap from '@/components/GoogleMap';
import AnimatedCounter from '@/components/AnimatedCounter';
import InteractivePartnerMap from '@/components/InteractivePartnerMap';
import TypingText from '@/components/TypingText';
import HolidayBanner from '@/components/HolidayBanner';
import { getProducts, getPosts, getCategories, getHeroSlides, getHomepageStats, getPartnerLogos, getHomepageServices } from '@/lib/db';
import { generateMetadata as genMeta, generateOrganizationSchema, generateWebSiteSchema, generateLocalBusinessSchema } from '@/lib/seo';
import type { Metadata } from 'next';

// Force dynamic rendering to always get fresh data
export const dynamic = 'force-dynamic';

export const metadata: Metadata = genMeta({
  title: 'NEW ATLANTIC - Tân Đại Tây Dương | Thiết bị công nghiệp chính hãng',
  description: 'Nhà phân phối chính hãng WILL-BURT, HIAB, SKYMARK tại Việt Nam. Cung cấp cột tự nâng, cẩu tự hành HIAB, thiết bị nâng hạ chất lượng cao. Hơn 22 năm kinh nghiệm, hỗ trợ 24/7.',
  path: '/',
  keywords: [
    'NEW ATLANTIC',
    'Tân Đại Tây Dương',
    'WILL-BURT',
    'HIAB',
    'SKYMARK',
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
  const products = getProducts();
  const posts = getPosts();
  const categories = getCategories();
  const heroSlides = getHeroSlides().filter(s => s.enabled).sort((a, b) => a.order - b.order);
  const homepageStats = getHomepageStats().sort((a, b) => a.order - b.order);
  const partnerLogos = getPartnerLogos().filter(p => p.enabled).sort((a, b) => a.order - b.order);
  const homepageServices = getHomepageServices().filter(s => s.enabled).sort((a, b) => a.order - b.order);

  const featuredProducts = products.filter((p) => p.featured).slice(0, 3);
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
      <HeroSlider slides={heroSlides} />

      {/* Holiday Banner - Dynamic */}
      <section className="py-6 sm:py-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <HolidayBanner variant="hero" />
          </div>
        </div>
      </section>

      {/* Company Slogan Section - Animated Gradient Background */}
      <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden animate-gradient-slow" style={{ backgroundImage: 'linear-gradient(-45deg, #1a1a2e, #16213e, #0f3460, #1a1a2e)', backgroundSize: '400% 400%' }}>
        {/* Modern Abstract Background */}
        <div className="absolute inset-0">
          {/* Gradient Orbs */}
          <div className="absolute top-0 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#5f7ab8]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-[#4a6199]/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

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
              <div className="bg-gradient-to-br from-gray-800/90 via-gray-900/90 to-black/90 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg border border-gray-700/60 p-4 sm:p-6 md:p-8 lg:p-10 relative overflow-hidden">
                {/* Accent Border Top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#5f7ab8] to-transparent"></div>

                {/* Decorative Corner Elements - Hidden on mobile */}
                <div className="hidden md:block absolute top-8 left-8 w-16 lg:w-20 h-16 lg:h-20 border-t-2 border-l-2 border-[#5f7ab8]/20 rounded-tl-3xl"></div>
                <div className="hidden md:block absolute bottom-8 right-8 w-16 lg:w-20 h-16 lg:h-20 border-b-2 border-r-2 border-[#5f7ab8]/20 rounded-br-3xl"></div>

                {/* Content */}
                <div className="relative">


                  {/* Slogan Text - Typing Effect */}
                  <div className="text-center space-y-3 sm:space-y-4">
                    <h2 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold leading-tight px-2">
                      <span className="bg-gradient-to-r from-white via-[#5f7ab8] to-white bg-clip-text text-transparent animate-gradient" style={{ backgroundImage: 'linear-gradient(90deg, #fff, #5f7ab8, #fff, #5f7ab8, #fff)', backgroundSize: '200% 100%' }}>
                        <TypingText
                          texts={['PHÁT TRIỂN PHỒN VINH XÂY THỊNH VƯỢNG']}
                          typingSpeed={60}
                          pauseTime={5000}
                          loop={false}
                        />
                      </span>
                    </h2>

                    {/* Divider */}
                    <div className="flex items-center justify-center gap-2 py-1">
                      <div className="w-8 sm:w-10 h-px bg-gradient-to-r from-transparent to-[#5f7ab8]"></div>
                      <div className="w-1.5 h-1.5 bg-[#5f7ab8] rounded-full"></div>
                      <div className="w-8 sm:w-10 h-px bg-gradient-to-l from-transparent to-[#5f7ab8]"></div>
                    </div>

                    <h2 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold leading-tight px-2">
                      <span className="bg-gradient-to-r from-white via-[#5f7ab8] to-white bg-clip-text text-transparent">
                        TỰ HÀO BỐN CHỮ TÂN ĐẠI TÂY DƯƠNG
                      </span>
                    </h2>
                  </div>

                  {/* Bottom Accent */}
                  <div className="flex justify-center mt-4 sm:mt-6">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-[#5f7ab8] rounded-full animate-pulse"></div>
                      <div className="w-1.5 h-1.5 bg-[#5f7ab8] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1.5 h-1.5 bg-[#5f7ab8] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Company Overview - About Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-800 via-gray-900 to-black relative overflow-hidden">
        {/* Background Elements - Simplified */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute w-96 h-96 bg-[#5f7ab8]/10 rounded-full blur-3xl top-20 -right-48"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
              <ScrollAnimation direction="left">
                <div className="space-y-6 sm:space-y-8">
                  <div>
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gray-800 text-gray-300 rounded-full text-sm md:text-base font-semibold mb-4 sm:mb-5 tracking-wide uppercase border border-gray-700">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Về chúng tôi
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 leading-tight">
                      Hành trình phát triển
                      <span className="block text-white">
                        từ 2003
                      </span>
                    </h2>
                  </div>

                  <div className="space-y-4 sm:space-y-5 text-gray-300 text-base sm:text-lg lg:text-xl leading-relaxed">
                    <p>
                      <strong className="text-white">Công ty Cổ phần Thương mại Quốc tế Tân Đại Tây Dương</strong> thành lập ngày 14/05/2003, với nỗ lực không ngừng đã phát triển từ một doanh nghiệp nhỏ thành một công ty uy tín trong và ngoài nước.
                    </p>
                    <p>
                      Với doanh thu nhiều năm nằm trong <strong className="text-white">top 5 doanh nghiệp lớn nhất tại Quận 7, TP. Hồ Chí Minh</strong>, chúng tôi tự hào là đối tác tin cậy của các thương hiệu hàng đầu.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <Link
                      href="/san-pham"
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-white/15 hover:shadow-2xl hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                    >
                      Khám phá sản phẩm
                    </Link>
                    <Link
                      href="/lien-he"
                      className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 text-sm sm:text-base"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Liên hệ tư vấn
                    </Link>
                  </div>
                </div>
              </ScrollAnimation>

              <ScrollAnimation direction="right">
                <div className="relative">
                  {/* Stats Grid - Dynamic from Admin */}
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    {homepageStats.length > 0 ? homepageStats.map((stat, index) => (
                      <div key={stat.id} className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                        <div className="text-3xl md:text-5xl font-bold text-white mb-1 md:mb-2">
                          {stat.suffix ? (
                            <AnimatedCounter
                              end={parseInt(stat.value.replace(/[^0-9]/g, '')) || 0}
                              suffix={stat.suffix}
                              duration={2000 + (index * 200)}
                            />
                          ) : (
                            stat.value
                          )}
                        </div>
                        <div className="text-sm md:text-base text-white/80">{stat.label}</div>
                      </div>
                    )) : (
                      <>
                        {/* Fallback stats if no data */}
                        <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                          <div className="text-3xl md:text-5xl font-bold text-white mb-1 md:mb-2">
                            <AnimatedCounter end={22} suffix="+" duration={2000} />
                          </div>
                          <div className="text-sm md:text-base text-white/80">Năm kinh nghiệm</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                          <div className="text-3xl md:text-5xl font-bold text-white mb-1 md:mb-2">
                            <AnimatedCounter end={500} suffix="+" duration={2000} />
                          </div>
                          <div className="text-sm md:text-base text-white/80">Khách hàng tin tưởng</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                          <div className="text-3xl md:text-5xl font-bold text-white mb-1 md:mb-2">
                            <AnimatedCounter end={1000} suffix="+" duration={2500} />
                          </div>
                          <div className="text-sm md:text-base text-white/80">Sản phẩm đã cung cấp</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                          <div className="text-3xl md:text-5xl font-bold text-white mb-1 md:mb-2">24/7</div>
                          <div className="text-sm md:text-base text-white/80">Hỗ trợ kỹ thuật</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </section>

      {/* Products & Services Detail Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-black via-gray-900 to-gray-800 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <ScrollAnimation direction="up">
              <div className="text-center mb-12 md:mb-16">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-amber-900/40 text-amber-300 rounded-full text-sm md:text-base font-semibold mb-6 tracking-wide uppercase border border-amber-700/30">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  SẢN PHẨM & DỊCH VỤ
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight uppercase">
                  NHÀ PHÂN PHỐI HÀNG ĐẦU
                  <span className="block text-white uppercase">CÁC THƯƠNG HIỆU NỔI TIẾNG</span>
                </h2>
                <p className="text-gray-300 text-sm md:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
                  <strong className="text-white">Tân Đại Tây Dương</strong> là nhà phân phối hàng đầu tại Việt Nam cho các thương hiệu nổi tiếng thế giới như <strong className="text-white">WILL-BURT, HIAB, SKYMARK</strong>. Chúng tôi cung cấp sản phẩm và dịch vụ chính hãng.
                </p>
              </div>
            </ScrollAnimation>

            {/* Services Grid - Dynamic từ Admin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {homepageServices.length > 0 ? homepageServices.map((service, index) => (
                <ScrollAnimation
                  key={service.id}
                  direction={index % 2 === 0 ? "left" : "right"}
                  delay={index * 100}
                >
                  <div
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 lg:p-8 hover:bg-white/15 hover:shadow-2xl transition-all duration-300 border-l-4"
                    style={{ borderColor: service.color }}
                  >
                    <span
                      className="text-sm font-semibold uppercase tracking-wider mb-2 block"
                      style={{ color: service.color }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{service.title}</h3>
                    <p className="text-white/80 text-base leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </ScrollAnimation>
              )) : (
                <>
                  {/* Fallback - Dữ liệu mặc định nếu chưa có trong admin */}
                  <ScrollAnimation direction="left" delay={0}>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 lg:p-8 hover:bg-white/15 hover:shadow-2xl transition-all duration-300 border-l-4 border-[#5f7ab8]">
                      <span className="text-[#5f7ab8] text-sm font-semibold uppercase tracking-wider mb-2 block">01</span>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Cẩu tự hành</h3>
                      <p className="text-white/80 text-base leading-relaxed">
                        Cẩu tự hành HIAB với nhiều tải trọng và kích thước khác nhau, phù hợp với mọi nhu cầu của khách hàng.
                      </p>
                    </div>
                  </ScrollAnimation>
                  <ScrollAnimation direction="right" delay={100}>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 lg:p-8 hover:bg-white/15 hover:shadow-2xl transition-all duration-300 border-l-4 border-[#10b981]">
                      <span className="text-[#10b981] text-sm font-semibold uppercase tracking-wider mb-2 block">02</span>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Thiết bị cơ giới</h3>
                      <p className="text-white/80 text-base leading-relaxed">
                        SKYMARK với chất lượng cao và giá cả cạnh tranh, đáp ứng mọi yêu cầu nâng hạ hàng hóa.
                      </p>
                    </div>
                  </ScrollAnimation>
                  <ScrollAnimation direction="left" delay={200}>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 lg:p-8 hover:bg-white/15 hover:shadow-2xl transition-all duration-300 border-l-4 border-[#f59e0b]">
                      <span className="text-[#f59e0b] text-sm font-semibold uppercase tracking-wider mb-2 block">03</span>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Phụ tùng thay thế</h3>
                      <p className="text-white/80 text-base leading-relaxed">
                        Cung cấp đầy đủ phụ tùng thay thế chính hãng, đảm bảo chất lượng và độ bền cao.
                      </p>
                    </div>
                  </ScrollAnimation>
                  <ScrollAnimation direction="right" delay={300}>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 lg:p-8 hover:bg-white/15 hover:shadow-2xl transition-all duration-300 border-l-4 border-[#3b82f6]">
                      <span className="text-[#3b82f6] text-sm font-semibold uppercase tracking-wider mb-2 block">04</span>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Sửa chữa & Bảo trì</h3>
                      <p className="text-white/80 text-base leading-relaxed">
                        Đội ngũ kỹ thuật viên chuyên nghiệp, giàu kinh nghiệm, sẵn sàng hỗ trợ khách hàng 24/7.
                      </p>
                    </div>
                  </ScrollAnimation>
                </>
              )}
            </div>

            {/* Commitment Box */}
            <ScrollAnimation direction="up" delay={400}>
              <div className="mt-12 bg-white/10 backdrop-blur-md rounded-2xl p-6 lg:p-8 border-l-4 border-[#5f7ab8] shadow-lg">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Cam kết của chúng tôi</h3>
                <p className="text-white/90 text-base md:text-lg leading-relaxed">
                  <strong className="text-white">Tân Đại Tây Dương</strong> cam kết mang đến cho khách hàng những sản phẩm và dịch vụ <strong className="text-white">chất lượng cao nhất</strong>, với <strong className="text-white">giá cả cạnh tranh</strong> và <strong className="text-white">dịch vụ hậu mãi chu đáo</strong>. Chúng tôi luôn nỗ lực để trở thành đối tác tin cậy của khách hàng trong mọi lĩnh vực.
                </p>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Products & Brands Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
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
                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gray-800 text-gray-300 rounded-full text-sm md:text-base font-semibold mb-4 tracking-wide uppercase border border-gray-700">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  Sản phẩm & Thương hiệu
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                  Đối tác của các
                  <span className="block text-white">
                    thương hiệu hàng đầu
                  </span>
                </h2>
                <p className="text-gray-300 text-sm md:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
                  Nhà phân phối chính thức của <strong className="text-white">WILL-BURT, HIAB, SKYMARK</strong> tại Việt Nam với cam kết chất lượng và dịch vụ tốt nhất
                </p>
              </ScrollAnimation>
            </div>
          </div>

          <div className={`grid gap-6 lg:gap-8 max-w-6xl mx-auto bg-gradient-to-br from-gray-800/60 via-gray-900/60 to-black/60 backdrop-blur-xl rounded-2xl p-6 lg:p-8 hover:from-gray-700/70 hover:via-gray-800/70 hover:to-gray-900/70 hover:shadow-2xl hover:shadow-[#5f7ab8]/10 transition-all duration-500 border border-gray-600/30 hover:border-[#5f7ab8]/50 ${categories.length <= 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : categories.length === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
            {categories.map((category, index) => (
              <ScrollAnimation key={category.id} direction={index % 2 === 0 ? "left" : "right"} delay={index * 100}>
                <div className="group bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:bg-white/15 hover:shadow-2xl hover:shadow-[#5f7ab8]/20 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col border border-white/20 hover:border-[#5f7ab8]/60">
                  <div className="h-40 sm:h-44 md:h-48 bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden p-6">
                    <img
                      src={category.image || '/images/box-image/MAY.jpg'}
                      alt={category.name}
                      className="w-full h-full object-contain object-center group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 md:p-6 flex flex-col flex-grow">
                    <h3 className="font-bold text-base md:text-lg lg:text-xl text-white mb-2 md:mb-3">{category.name}</h3>
                    <p className="text-xs md:text-sm text-white mb-4 md:mb-5 flex-grow leading-relaxed">
                      {category.description || `Khám phá các sản phẩm ${category.name} chất lượng cao từ NEW ATLANTIC.`}
                    </p>
                    <Link href={`/san-pham/${category.slug}`} className="inline-flex items-center gap-2 text-white font-semibold hover:gap-3 transition-all group-hover:text-white/80 text-xs md:text-sm">
                      Khám phá ngay
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-900 via-black to-gray-900 relative overflow-hidden">
        {/* Background Elements - Simplified */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute w-[500px] h-[500px] bg-[#5f7ab8]/8 rounded-full blur-3xl -top-48 -left-48"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <ScrollAnimation direction="up">
              <div className="mb-16 md:mb-20 text-center">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-rose-900/40 text-rose-300 rounded-full text-sm md:text-base font-semibold mb-4 tracking-wide uppercase border border-rose-700/30">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  Dịch vụ chuyên nghiệp
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                  Giải pháp
                  <span className="block text-white">
                    toàn diện & chuyên nghiệp
                  </span>
                </h2>
                <p className="text-gray-300 text-sm md:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
                  Cung cấp dịch vụ tư vấn, thiết kế, cung ứng và bảo trì thiết bị công nghiệp chất lượng cao
                </p>
              </div>
            </ScrollAnimation>
          </div>

          {/* Main Services */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <ScrollAnimation direction="left" delay={0}>
              <div className="group bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 lg:p-8 hover:bg-white/15 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 h-full">

                <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">Thiết Bị PCCC</h3>
                <p className="text-base text-white mb-5 leading-relaxed">
                  Cung cấp và thi công hệ thống phòng cháy chữa cháy đạt tiêu chuẩn quốc tế, bảo vệ tài sản và tính mạng.
                </p>
                <ul className="space-y-2.5 text-base text-white">
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
              <div className="group bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 lg:p-8 hover:bg-white/15 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 h-full">

                <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">Thiết Bị Điện</h3>
                <p className="text-base text-white mb-5 leading-relaxed">
                  Cung ứng và tư vấn hệ thống điện công nghiệp, đảm bảo vận hành liên tục và an toàn tuyệt đối.
                </p>
                <ul className="space-y-2.5 text-base text-white">
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
              <div className="group bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 lg:p-8 hover:bg-white/15 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 h-full">

                <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">Thiết Bị Chuyên Ngành</h3>
                <p className="text-base text-white mb-5 leading-relaxed">
                  Cung cấp thiết bị chuyên dụng cho các ngành công nghiệp, xây dựng và quốc phòng với chất lượng hàng đầu.
                </p>
                <ul className="space-y-2.5 text-base text-white">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#5f7ab8] rounded-full"></div>
                    Cẩu tự hành HIAB đa tải trọng
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#5f7ab8] rounded-full"></div>
                    Máy móc LOVOL, SKYMARK
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
      <section className="py-16 md:py-24 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <ScrollAnimation direction="up">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 md:mb-16">
                <div className="mb-6 lg:mb-0">
                  <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-violet-900/40 text-violet-300 rounded-full text-sm md:text-base font-semibold mb-4 tracking-wide uppercase border border-violet-700/30">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    Sản phẩm nổi bật
                  </div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                    Sản phẩm nổi bật
                  </h2>
                  <p className="text-gray-300 text-base md:text-lg lg:text-xl max-w-2xl leading-relaxed">
                    Khám phá các sản phẩm chất lượng cao được tin dùng
                  </p>
                </div>
                <Link
                  href="/san-pham"
                  className="inline-flex items-center gap-2 text-white hover:text-white/80 font-medium text-sm md:text-base group transition-colors duration-200"
                >
                  Xem tất cả sản phẩm
                  <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </ScrollAnimation>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredProducts.map((product, index) => (
              <ScrollAnimation
                key={product.id}
                direction={index % 2 === 0 ? 'left' : 'right'}
                delay={index * 150}
                className="h-full"
              >
                <ProductCard
                  product={product}
                  className="h-full"
                />
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Video Background CTA Section */}
      <section className="relative min-h-[700px] sm:min-h-[650px] md:min-h-[700px] lg:min-h-[750px] overflow-hidden">
        {/* Lazy Video Background - Try backup video if main fails */}
        <LazyVideoBackground
          videoSrc="/api/video?id=hero-2"
          posterImage="/images/place-holder/telescopic-mast-tower.jpg"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover"
        />

        {/* Content */}
        <div className="relative h-full flex items-center justify-center z-10 py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollAnimation direction="up">
              <div className="max-w-5xl mx-auto text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 bg-white/10 backdrop-blur-sm text-white rounded-full text-xs sm:text-sm md:text-base font-semibold mb-4 sm:mb-6 md:mb-8 border border-white/20">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  TẠI SAO CHỌN CHÚNG TÔI
                </div>

                {/* Main Heading */}
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight drop-shadow-lg px-2">
                  Tại Sao Chọn Chúng Tôi?
                </h2>

                {/* Description */}
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-10 lg:mb-12 leading-relaxed max-w-3xl mx-auto drop-shadow-md px-4">
                  Cam kết mang đến giá trị tốt nhất cho khách hàng với dịch vụ chuyên nghiệp và sản phẩm chất lượng cao
                </p>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mb-6 sm:mb-8 md:mb-10 lg:mb-12 px-2 sm:px-4">
                  {/* Card 1 - Sản Phẩm Chính Hãng */}
                  <div className="bg-white/10 backdrop-blur-md border-t-4 border-blue-500 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl text-center">
                    <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-1.5 sm:mb-2 md:mb-3">Sản Phẩm Chính Hãng</h3>
                    <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed">
                      100% sản phẩm nhập khẩu trực tiếp từ nhà sản xuất, đầy đủ chứng nhận và giấy tờ xuất xứ
                    </p>
                  </div>

                  {/* Card 2 - Bảo Hành Toàn Diện */}
                  <div className="bg-white/10 backdrop-blur-md border-t-4 border-green-500 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl text-center">
                    <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-1.5 sm:mb-2 md:mb-3">Bảo Hành Toàn Diện</h3>
                    <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed">
                      Chế độ bảo hành chính hãng dài hạn, hỗ trợ kỹ thuật 24/7 với đội ngũ chuyên gia giàu kinh nghiệm
                    </p>
                  </div>

                  {/* Card 3 - Đội Ngũ Chuyên Nghiệp */}
                  <div className="bg-white/10 backdrop-blur-md border-t-4 border-purple-500 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl text-center">
                    <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-1.5 sm:mb-2 md:mb-3">Đội Ngũ Chuyên Nghiệp</h3>
                    <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed">
                      Kỹ thuật viên được đào tạo bài bản tại nhà máy, tư vấn nhiệt tình và hỗ trợ tận nơi
                    </p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center px-2 sm:px-4">
                  <Link
                    href="/lien-he"
                    className="group inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-md text-white px-5 py-2.5 sm:px-6 sm:py-3 md:px-7 md:py-3.5 rounded-full font-semibold hover:bg-gray-100/20 transition-all duration-300 shadow-lg hover:bg-white/15 hover:shadow-2xl hover:scale-105 text-xs sm:text-sm md:text-base w-full sm:w-auto"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Liên hệ ngay
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>

                  <Link
                    href="/page-download-catalog"
                    className="group inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-transparent border-2 border-white text-white px-5 py-2.5 sm:px-6 sm:py-3 md:px-7 md:py-3.5 rounded-full font-semibold hover:bg-white/15 hover:text-white transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 text-xs sm:text-sm md:text-base w-full sm:w-auto"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Tải catalog
                  </Link>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50/50 to-transparent pointer-events-none"></div>
      </section>



      {/* Partners Network */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <ScrollAnimation direction="up">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-rose-900/40 text-rose-300 rounded-full text-sm md:text-base font-semibold mb-4 tracking-wide uppercase border border-rose-700/30">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  Đối tác đa quốc gia
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                  Quan hệ đối tác
                </h2>
                <p className="text-gray-300 text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
                  Nhờ vào sự hợp tác chặt chẽ và hiệu quả với các đối tác chiến lược tại các thị trường quan trọng như <strong className="text-white">Bắc Mỹ, Châu Âu, Châu Á và Trung Đông</strong>, chúng tôi có khả năng cung cấp các giải pháp và dịch vụ tiên tiến, đáp ứng nhu cầu đa dạng của khách hàng toàn cầu.
                </p>
              </ScrollAnimation>
            </div>

            {/* Partners Grid */}
            <ScrollAnimation direction="up">
              <div className="max-w-6xl mx-auto">
                {/* First row - 3 logos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mb-4 mx-auto">
                  <div className="group relative bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl p-6 lg:p-8 hover:shadow-2xl hover:shadow-[#5f7ab8]/30 transition-all duration-500 border border-white/30 hover:border-[#5f7ab8]/70 flex items-center justify-center aspect-[4/3] hover:scale-[1.02]">
                    <img src="/images/partner/airbones.png" alt="ST Airborne Systems" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="group relative bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl p-6 lg:p-8 hover:shadow-2xl hover:shadow-[#5f7ab8]/30 transition-all duration-500 border border-white/30 hover:border-[#5f7ab8]/70 flex items-center justify-center aspect-[4/3] hover:scale-[1.02]">
                    <img src="/images/partner/eldis.png" alt="Eldis Radar Systems" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="group relative bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl p-6 lg:p-8 hover:shadow-2xl hover:shadow-[#5f7ab8]/30 transition-all duration-500 border border-white/30 hover:border-[#5f7ab8]/70 flex items-center justify-center aspect-[4/3] hover:scale-[1.02]">
                    <img src="/images/partner/hiab.png" alt="HIAB" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                  </div>
                </div>

                {/* Second row - 3 logos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
                  <div className="group relative bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl p-6 lg:p-8 hover:shadow-2xl hover:shadow-[#5f7ab8]/30 transition-all duration-500 border border-white/30 hover:border-[#5f7ab8]/70 flex items-center justify-center aspect-[4/3] hover:scale-[1.02]">
                    <img src="/images/partner/lovol.png" alt="Weichai Lovol" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="group relative bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl p-6 lg:p-8 hover:shadow-2xl hover:shadow-[#5f7ab8]/30 transition-all duration-500 border border-white/30 hover:border-[#5f7ab8]/70 flex items-center justify-center aspect-[4/3] hover:scale-[1.02]">
                    <img src="/images/partner/LS.png" alt="SKYMARK" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="group relative bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl p-6 lg:p-8 hover:shadow-2xl hover:shadow-[#5f7ab8]/30 transition-all duration-500 border border-white/30 hover:border-[#5f7ab8]/70 flex items-center justify-center aspect-[4/3] hover:scale-[1.02]">
                    <img src="/images/partner/petronas.png" alt="Petronas" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                  </div>
                </div>
              </div>

              {/* Interactive Partner Map */}
              <div className="mt-12">
                <InteractivePartnerMap />
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <Certifications />

      {/* Testimonials */}
      <Testimonials />

      {/* FAQs */}
      <FAQs />

      {/* Locations */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
        {/* Background Elements - Simplified */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute w-[500px] h-[500px] bg-[#5f7ab8]/8 rounded-full blur-3xl top-20 -right-48"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <ScrollAnimation direction="up">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gray-800 text-gray-300 rounded-full text-sm md:text-base font-semibold mb-4 tracking-wide uppercase border border-gray-700">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Hệ thống chi nhánh
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                  Phủ sóng{' '}
                  <span className="text-white">
                    toàn quốc
                  </span>
                </h2>
                <p className="text-gray-300 text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
                  Với hệ thống chi nhánh từ Bắc vào Nam, chúng tôi luôn sẵn sàng phục vụ khách hàng mọi lúc, mọi nơi
                </p>
              </ScrollAnimation>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
              {/* HCM Office */}
              <ScrollAnimation direction="left" delay={0}>
                <div className="group bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 lg:p-8 hover:bg-white/15 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-[#5f7ab8] h-full">

                  <div className="inline-block px-5 py-2.5 bg-[#5f7ab8]/20 backdrop-blur-sm text-[#5f7ab8] rounded-full text-sm md:text-base font-semibold mb-4 border border-[#5f7ab8]/30">
                    TRỤ SỞ CHÍNH
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-4 text-white">TP. Hồ Chí Minh</h3>
                  <div className="space-y-3 mb-5">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#5f7ab8] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-base text-white leading-relaxed">
                        A60 Phú Thuận, Phường Phú Thuận, Quận 7, TP. Hồ Chí Minh
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <a href="tel:+842838733686" className="inline-flex items-center gap-2 text-[white] hover:text-[#4a6199] font-semibold transition-colors text-base">
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
                <div className="group bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 lg:p-8 hover:bg-white/15 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-green-500 h-full">

                  <div className="inline-block px-5 py-2.5 bg-green-500/20 backdrop-blur-sm text-green-300 rounded-full text-sm md:text-base font-semibold mb-4 border border-green-500/30">
                    CHI NHÁNH MIỀN BẮC
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-4 text-white">Hà Nội</h3>
                  <div className="space-y-3 mb-5">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#5f7ab8] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-base text-white leading-relaxed">
                        Số 85 Nguyễn Phong Sắc, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <a href="tel:+842838733686" className="inline-flex items-center gap-2 text-[white] hover:text-[#4a6199] font-semibold transition-colors text-base">
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
                <div className="group bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 lg:p-8 hover:bg-white/15 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-orange-500 h-full">

                  <div className="inline-block px-5 py-2.5 bg-orange-500/20 backdrop-blur-sm text-orange-300 rounded-full text-sm md:text-base font-semibold mb-4 border border-orange-500/30">
                    CHI NHÁNH MIỀN TRUNG
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-4 text-white">Quảng Trị</h3>
                  <div className="space-y-3 mb-5">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#5f7ab8] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-base text-white leading-relaxed">
                        Xã Triệu Giang, Huyện Triệu Phong, Tỉnh Quảng Trị
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <a href="tel:+842838733686" className="inline-flex items-center gap-2 text-[white] hover:text-[#4a6199] font-semibold transition-colors text-base">
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
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation direction="up">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 md:mb-16">
                <div className="mb-6 lg:mb-0">
                  <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-cyan-900/40 text-cyan-300 rounded-full text-sm md:text-base font-semibold mb-4 tracking-wide uppercase border border-cyan-700/30">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Tin Tức & Sự Kiện
                  </div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                    Cập nhật mới nhất
                  </h2>
                  <p className="text-gray-300 text-base md:text-lg lg:text-xl max-w-2xl leading-relaxed">
                    Thông tin về sản phẩm, công nghệ và các sự kiện quan trọng trong ngành
                  </p>
                </div>
                <Link
                  href="/tin-tuc"
                  className="inline-flex items-center gap-2 text-white hover:text-white/80 font-medium text-sm md:text-base group transition-colors duration-200"
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
