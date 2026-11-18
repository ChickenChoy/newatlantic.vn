import ProductCard from '@/components/ProductCard';
import PostCard from '@/components/PostCard';
import HeroSlider from '@/components/HeroSlider';
import LazyVideoBackground from '@/components/LazyVideoBackground';
import Testimonials from '@/components/Testimonials';
import FAQs from '@/components/FAQs';
import Certifications from '@/components/Certifications';
import InteractivePartnerMap from '@/components/InteractivePartnerMap';
import TypingText from '@/components/TypingText';
import HolidayBanner from '@/components/HolidayBanner';
import EmptyState from '@/components/EmptyState';
import Reveal from '@/components/motion/Reveal';
import StaggerGroup from '@/components/motion/StaggerGroup';
import {
  ArrowButton,
  BrandMarquee,
  CTABand,
  Eyebrow,
  ProcessSteps,
  Section,
  SectionHeader,
  ServiceCard,
  StatBand,
} from '@/components/sections';
import { getProducts, getPosts, getCategories, getHeroSlides, getHomepageStats, getPartnerLogos, getHomepageServices } from '@/lib/db';
import { generateMetadata as genMeta, generateOrganizationSchema, generateWebSiteSchema, generateLocalBusinessSchema } from '@/lib/seo';
import type { Metadata } from 'next';
import type { Product, HeroSlide, HomepageStat, PartnerLogo, HomepageService } from '@/types';
import type { ProcessStep } from '@/components/sections';
import type { StatItem } from '@/components/sections';

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

/** Shown until the stats are configured in the admin panel. */
const FALLBACK_STATS: StatItem[] = [
  { id: 'years', value: '22', suffix: '+', label: 'Năm kinh nghiệm' },
  { id: 'clients', value: '1000', suffix: '+', label: 'Khách hàng tin tưởng' },
  { id: 'brands', value: '5', suffix: '+', label: 'Thương hiệu phân phối' },
  { id: 'support', value: '24/7', label: 'Hỗ trợ kỹ thuật' },
];

/** The four steps every NewAtlantic equipment order goes through. */
const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 'survey',
    title: 'Khảo sát hiện trường',
    description: 'Kỹ sư đến tận công trình, đo tải trọng, chiều cao nâng và điều kiện vận hành thực tế.',
  },
  {
    id: 'proposal',
    title: 'Đề xuất cấu hình',
    description: 'Chọn model WILL-BURT, HIAB hoặc SKYMARK phù hợp, kèm dự toán và tiến độ giao hàng.',
  },
  {
    id: 'install',
    title: 'Lắp đặt & nghiệm thu',
    description: 'Thi công, chạy thử tải và bàn giao đầy đủ hồ sơ kỹ thuật, CO – CQ theo quy định.',
  },
  {
    id: 'maintain',
    title: 'Bảo trì định kỳ',
    description: 'Hợp đồng bảo dưỡng, phụ tùng chính hãng và hỗ trợ kỹ thuật 24/7 trên toàn quốc.',
  },
];

/** The three offices, north to south. Addresses and numbers are the company's own. */
const OFFICES = [
  {
    id: 'hcm',
    badge: 'Trụ sở chính',
    city: 'TP. Hồ Chí Minh',
    address: 'A60 Phú Thuận, Phường Phú Thuận, Quận 7, TP. Hồ Chí Minh',
    phone: '+84 2838 733 686',
    tel: '+842838733686',
  },
 ];

/** The three promises the video band carries. */
const PROMISES = [
  {
    title: 'Sản phẩm chính hãng',
    description: '100% nhập khẩu trực tiếp từ nhà sản xuất, đầy đủ chứng nhận và giấy tờ xuất xứ.',
  },
  {
    title: 'Bảo hành toàn diện',
    description: 'Chế độ bảo hành chính hãng dài hạn, hỗ trợ kỹ thuật 24/7 với đội ngũ chuyên gia.',
  },
  {
    title: 'Đội ngũ chuyên nghiệp',
    description: 'Kỹ thuật viên được đào tạo tại nhà máy, tư vấn nhiệt tình và hỗ trợ tận nơi.',
  },
];

export default async function HomePage() {
  const products = await getProducts();
  const posts = await getPosts();
  const categories = await getCategories();
  const allHeroSlides = await getHeroSlides();
  const allHomepageStats = await getHomepageStats();
  const allPartnerLogos = await getPartnerLogos();
  const allHomepageServices = await getHomepageServices();

  // Filter and sort with proper typing
  const heroSlides = allHeroSlides.filter((s: HeroSlide) => s.enabled).sort((a: HeroSlide, b: HeroSlide) => a.order - b.order);
  const homepageStats = allHomepageStats.sort((a: HomepageStat, b: HomepageStat) => a.order - b.order);
  const partnerLogos = allPartnerLogos.filter((p: PartnerLogo) => p.enabled).sort((a: PartnerLogo, b: PartnerLogo) => a.order - b.order);
  const homepageServices = allHomepageServices.filter((s: HomepageService) => s.enabled).sort((a: HomepageService, b: HomepageService) => a.order - b.order);

  const featuredProducts = products.filter((p: Product) => p.featured && p.enabled !== false).slice(0, 3);
  const latestPosts = posts.slice(0, 3);

  const stats: StatItem[] = homepageStats.length > 0 ? homepageStats : FALLBACK_STATS;

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

      {/* Hero */}
      <HeroSlider slides={heroSlides} />

      {/* Brands we distribute — the template's trusted-by row. Deliberately not a
          <Section>: the row wants tighter padding than the 120px section rhythm. */}
      {partnerLogos.length > 0 && (
        <div className="bg-surface py-16">
          <div className="mx-auto w-full max-w-site px-5 md:px-gutter">
            <BrandMarquee
              logos={partnerLogos}
              label="Thương hiệu NEW ATLANTIC phân phối tại Việt Nam"
            />
          </div>
        </div>
      )}

      {/* Holiday banner — the wrapper collapses via `empty:hidden` on days when
          no holiday effect is enabled and HolidayBanner renders nothing. */}
      <div className="mx-auto w-full max-w-site px-5 py-12 md:px-gutter empty:hidden">
        <HolidayBanner variant="hero" />
      </div>

      {/* Company slogan */}
      <Section tone="navy">
        <Reveal className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-d4 uppercase leading-display tracking-display text-white">
            <TypingText
              texts={['PHÁT TRIỂN PHỒN VINH XÂY THỊNH VƯỢNG']}
              typingSpeed={60}
              pauseTime={5000}
              loop={false}
            />
          </h2>

          <div className="my-8 flex items-center justify-center">
            <span className="h-px w-24 bg-white/14" />
          </div>

          <p className="font-display text-d4 uppercase leading-display tracking-display text-accent">
            Tự hào bốn chữ Tân Đại Tây Dương
          </p>
        </Reveal>
      </Section>

      {/* About */}
      <Section id="ve-chung-toi">
        <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal direction="left" className="flex flex-col gap-8">
            <span>
              <Eyebrow>Về chúng tôi</Eyebrow>
            </span>

            <h2 className="font-display text-d3 uppercase leading-display tracking-display text-navy">
              Hành trình từ năm 2003
            </h2>

            <div className="flex flex-col gap-5 text-base leading-[1.6] text-ink md:text-lg">
              <p>
                <strong className="text-navy">Công ty Cổ phần Thương mại Quốc tế Tân Đại Tây Dương</strong>{' '}
                thành lập ngày 14/05/2003. Từ một doanh nghiệp nhỏ, chúng tôi đã trở thành nhà phân phối
                thiết bị công nghiệp có tên trong và ngoài nước.
              </p>
              <p>
                Doanh thu nhiều năm liền nằm trong{' '}
                <strong className="text-navy">top 5 doanh nghiệp lớn nhất Quận 7, TP. Hồ Chí Minh</strong> —
                kết quả của việc chọn đúng thương hiệu và giữ đúng cam kết với khách hàng.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <ArrowButton href="/san-pham" variant="accent">
                Khám phá sản phẩm
              </ArrowButton>
              <ArrowButton href="/lien-he" variant="outline">
                Liên hệ tư vấn
              </ArrowButton>
            </div>
          </Reveal>

          <Reveal direction="right">
            <StatBand stats={stats} />
          </Reveal>
        </div>
      </Section>

      {/* Services */}
      <Section tone="surface" id="dich-vu">
        <SectionHeader
          eyebrow="Sản phẩm & dịch vụ"
          title="Giải pháp thiết bị toàn diện"
          intro="Nhà phân phối WILL-BURT, HIAB và SKYMARK tại Việt Nam — từ cung ứng thiết bị đến thi công, phụ tùng và bảo trì."
          action={<ArrowButton href="/san-pham" variant="navy">Xem tất cả</ArrowButton>}
          className="mb-16"
        />

        {homepageServices.length > 0 ? (
          <StaggerGroup className="grid items-stretch gap-8 md:grid-cols-2 lg:grid-cols-4">
            {homepageServices.map((service, index) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                description={service.description}
                index={index + 1}
              />
            ))}
          </StaggerGroup>
        ) : (
          <StaggerGroup className="grid items-stretch gap-8 md:grid-cols-2 lg:grid-cols-4">
            <ServiceCard
              index={1}
              title="Cẩu tự hành"
              description="Cẩu tự hành HIAB với nhiều tải trọng và kích thước, phù hợp mọi nhu cầu nâng hạ trên công trình."
            />
            <ServiceCard
              index={2}
              title="Thiết bị cơ giới"
              description="Máy móc SKYMARK chất lượng cao, giá cạnh tranh, đáp ứng yêu cầu vận chuyển và nâng hạ hàng hóa."
            />
            <ServiceCard
              index={3}
              title="Phụ tùng thay thế"
              description="Phụ tùng chính hãng đầy đủ cho toàn bộ dòng thiết bị chúng tôi phân phối, sẵn kho tại Việt Nam."
            />
            <ServiceCard
              index={4}
              title="Sửa chữa & bảo trì"
              description="Đội kỹ thuật viên giàu kinh nghiệm, có mặt tại hiện trường và trực hỗ trợ 24/7."
            />
          </StaggerGroup>
        )}

        <Reveal delay={200} className="mt-12 rounded-card border border-navy/14 bg-background p-8 md:p-10">
          <h3 className="font-display text-d5 uppercase leading-display tracking-display text-navy">
            Cam kết của chúng tôi
          </h3>
          <p className="mt-4 max-w-4xl text-base leading-[1.6] text-ink md:text-lg">
            Thiết bị <strong className="text-navy">chính hãng</strong>, giá{' '}
            <strong className="text-navy">cạnh tranh</strong>, hậu mãi{' '}
            <strong className="text-navy">chu đáo</strong>. Ba điều đó là lý do khách hàng quay lại với
            Tân Đại Tây Dương sau mỗi dự án.
          </p>
        </Reveal>
      </Section>

      {/* Product categories */}
      {categories.length > 0 && (
        <Section>
          <SectionHeader
            eyebrow="Danh mục"
            title="Chọn đúng thiết bị cho công trình"
            intro="Mỗi danh mục là một dòng thiết bị chúng tôi phân phối và bảo hành trực tiếp."
            className="mb-16"
          />

          <StaggerGroup className="grid items-stretch gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(category => (
              <ServiceCard
                key={category.id}
                title={category.name}
                description={
                  category.description ||
                  `Khám phá các sản phẩm ${category.name} chất lượng cao từ NEW ATLANTIC.`
                }
                image={category.image || '/images/box-image/MAY.jpg'}
                href={`/san-pham/${category.slug}`}
                linkText="Khám phá ngay"
              />
            ))}
          </StaggerGroup>
        </Section>
      )}

      {/* Featured products */}
      <Section tone="surface">
        <SectionHeader
          eyebrow="Sản phẩm nổi bật"
          title="Thiết bị được tin dùng"
          intro="Những model khách hàng công nghiệp Việt Nam đặt nhiều nhất trong năm nay."
          action={<ArrowButton href="/san-pham" variant="navy">Xem tất cả sản phẩm</ArrowButton>}
          className="mb-16"
        />

        {featuredProducts.length > 0 ? (
          <StaggerGroup className="grid items-stretch gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                priority={true} // All featured products are above-the-fold
              />
            ))}
          </StaggerGroup>
        ) : (
          <EmptyState
            title="Chưa có sản phẩm nổi bật"
            description="Hiện tại chưa có sản phẩm nào được đánh dấu là nổi bật. Vui lòng quay lại sau hoặc xem tất cả sản phẩm của chúng tôi."
            actionLabel="Xem tất cả sản phẩm"
            actionHref="/san-pham"
          />
        )}
      </Section>

      {/* Why us — video band */}
      <section className="relative isolate overflow-hidden bg-navy py-section">
        {/* Positions itself absolute inset-0 and carries its own navy scrim. */}
        <LazyVideoBackground
          videoSrc="/api/video?id=hero-2"
          posterImage="/images/place-holder/telescopic-mast-tower.jpg"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="relative z-10 mx-auto w-full max-w-site px-5 md:px-gutter">
          <SectionHeader
            eyebrow="Tại sao chọn chúng tôi"
            title="Chính hãng, bảo hành, tận nơi"
            intro="Ba điều khách hàng nhận được ở mọi đơn hàng, dù là một bộ phụ tùng hay cả hệ thống nâng hạ."
            layout="center"
            onDark
            className="mb-16"
          />

          <StaggerGroup className="grid gap-8 sm:grid-cols-3">
            {PROMISES.map(promise => (
              <div
                key={promise.title}
                className="h-full rounded-card border border-white/14 bg-white/10 p-8"
              >
                <h3 className="font-display text-d5 uppercase leading-display tracking-display text-white">
                  {promise.title}
                </h3>
                <p className="mt-4 text-base leading-[1.6] text-white/80">{promise.description}</p>
              </div>
            ))}
          </StaggerGroup>

          <Reveal delay={300} className="mt-14 flex flex-wrap items-center justify-center gap-4">
            <ArrowButton href="/lien-he" variant="accent">
              Liên hệ ngay
            </ArrowButton>
            <ArrowButton href="/page-download-catalog" variant="outline-light">
              Tải catalog
            </ArrowButton>
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <Section>
        <SectionHeader
          eyebrow="Quy trình"
          title="Bốn bước từ khảo sát đến bảo trì"
          intro="Cách chúng tôi làm việc trên mọi dự án, từ một cột tự nâng đơn lẻ đến cả đội xe cẩu."
          className="mb-16"
        />
        <ProcessSteps steps={PROCESS_STEPS} />
      </Section>

      {/* Certifications */}
      <Certifications />

      {/* Customer reviews */}
      <Testimonials />

      {/* Partner network */}
      <Section tone="surface">
        <SectionHeader
          eyebrow="Mạng lưới"
          title="Đối tác trên bốn châu lục"
          intro="Hợp tác chặt chẽ với các đối tác chiến lược tại Bắc Mỹ, Châu Âu, Châu Á và Trung Đông cho phép chúng tôi đưa thiết bị tiên tiến về Việt Nam nhanh nhất."
          layout="center"
          className="mb-16"
        />
        <Reveal>
          <InteractivePartnerMap />
        </Reveal>
      </Section>

      {/* Offices */}
      <Section id="chi-nhanh">
        <SectionHeader
          eyebrow="Hệ thống chi nhánh"
          title="Phủ sóng toàn quốc"
          intro="Ba văn phòng từ Bắc vào Nam, để kỹ thuật viên luôn ở gần công trình của bạn."
          className="mb-16"
        />

        <StaggerGroup className="grid items-stretch gap-8 md:grid-cols-3">
          {OFFICES.map(office => (
            <div
              key={office.id}
              className="flex h-full flex-col rounded-card border border-navy/14 bg-background p-8"
            >
              <span className="mb-6">
                <Eyebrow>{office.badge}</Eyebrow>
              </span>

              <h3 className="font-display text-d5 uppercase leading-display tracking-display text-navy">
                {office.city}
              </h3>

              <div className="mt-5 flex flex-grow items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <p className="text-base leading-[1.6] text-ink">{office.address}</p>
              </div>

              <a
                href={`tel:${office.tel}`}
                className="mt-6 inline-flex items-center gap-3 border-t border-navy/14 pt-6 text-base font-semibold text-navy transition-colors duration-300 ease-brand hover:text-accent"
              >
                <svg className="h-4 w-4 text-accent" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                {office.phone}
              </a>
            </div>
          ))}
        </StaggerGroup>
      </Section>

      {/* FAQs */}
      <FAQs />

      {/* Latest news */}
      {latestPosts.length > 0 && (
        <Section tone="surface">
          <SectionHeader
            eyebrow="Tin tức & sự kiện"
            title="Cập nhật mới nhất"
            intro="Thông tin về sản phẩm, công nghệ và các sự kiện quan trọng trong ngành."
            action={<ArrowButton href="/tin-tuc" variant="navy">Xem tất cả tin tức</ArrowButton>}
            className="mb-16"
          />

          <StaggerGroup className="grid items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </StaggerGroup>
        </Section>
      )}

      {/* Closing CTA */}
      <CTABand
        eyebrow="Bắt đầu dự án"
        title="Cần tư vấn thiết bị cho công trình?"
        intro="Gửi yêu cầu, kỹ sư của NEW ATLANTIC sẽ khảo sát và đề xuất cấu hình phù hợp trong ngày làm việc."
        actions={
          <>
            <ArrowButton href="/lien-he" variant="accent">
              Liên hệ tư vấn
            </ArrowButton>
            <ArrowButton href="/san-pham" variant="outline-light">
              Xem sản phẩm
            </ArrowButton>
          </>
        }
      />
    </>
  );
}
