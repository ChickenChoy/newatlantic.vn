import { posts } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ShareButtons from '@/components/ShareButtons';
import RelatedPostsSlider from '@/components/RelatedPostsSlider';
import { generateMetadata as genMeta, generateArticleSchema, generateBreadcrumbSchema } from '@/lib/seo';
import type { Metadata } from 'next';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find(p => p.slug === slug);
  
  if (!post) {
    return genMeta({
      title: 'Không tìm thấy',
      description: 'Bài viết không tồn tại.',
      path: `/tin-tuc/${slug}`,
      noIndex: true,
    });
  }

  return genMeta({
    title: post.title,
    description: post.excerpt || post.title,
    image: post.image,
    path: `/tin-tuc/${slug}`,
    keywords: [
      'tin tức NEW ATLANTIC',
      'thiết bị công nghiệp',
      'WILL-BURT',
      'HIAB',
      'SKYMARK',
    ],
  });
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = posts.find(p => p.slug === slug);
  
  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Get all posts (excluding current post)
  const relatedPosts = posts
    .filter(p => p.id !== post.id);

  // Generate structured data
  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.excerpt || post.title,
    image: post.image,
    datePublished: post.date,
    author: post.author,
    url: `/tin-tuc/${slug}`,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Trang chủ', url: '/' },
    { name: 'Tin tức', url: '/tin-tuc' },
    { name: post.title, url: `/tin-tuc/${slug}` },
  ]);

  return (
    <div className="bg-[#050c3a] min-h-screen pt-24 sm:pt-28 md:pt-32 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Breadcrumb */}
      <div className="relative z-10 border-b border-white/10 mt-12 md:mt-16">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-blue-400 transition">
              Trang chủ
            </Link>
            <span className="text-gray-500">/</span>
            <Link href="/tin-tuc" className="hover:text-blue-400 transition">
              Tin tức
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-blue-400 font-medium truncate">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Post Content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Main Content */}
            <article className="lg:col-span-3 bg-white/10 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-white/10">
          {/* Featured Image */}
          {post.image && (
                <div className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
              />
                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          )}

              {/* Post Header */}
              <div className="p-8 lg:p-12">
                {/* Meta Info */}
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">{formattedDate}</span>
                  </div>
              {post.author && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-medium">{post.author}</span>
                    </div>
              )}
            </div>

                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 leading-tight text-white">{post.title}</h1>

                {post.excerpt && (
                  <div className="bg-blue-500/10 border-l-4 border-blue-400 p-6 rounded-r-2xl mb-8">
                    <p className="text-lg lg:text-xl text-gray-300 leading-relaxed italic">
                      {post.excerpt}
                    </p>
                  </div>
                )}

                {/* Post Content */}
                <div className="prose prose-base lg:prose-lg max-w-none mb-10 prose-invert prose-p:text-gray-300 prose-headings:text-white prose-strong:text-white prose-a:text-blue-400">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />

                  {/* Rich Content for News */}
                  <div className="space-y-6 text-gray-300 leading-relaxed">
                    <p className="leading-relaxed">
                      NEW ATLANTIC tự hào là đại lý chính thức và độc quyền của các thương hiệu thiết bị công nghiệp
                      hàng đầu thế giới. Với cam kết mang đến giải pháp tối ưu nhất cho khách hàng, chúng tôi không ngừng
                      cập nhật và chia sẻ những thông tin mới nhất về sản phẩm, công nghệ và xu hướng ngành.
                    </p>

                    <div className="bg-blue-500/10 p-6 rounded-2xl border border-blue-400/20 my-8">
                      <h3 className="text-xl font-bold mb-3 text-white">Điểm nổi bật</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2.5">
                          <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm">Sản phẩm chính hãng, nhập khẩu trực tiếp từ nhà sản xuất</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm">Hỗ trợ kỹ thuật chuyên nghiệp 24/7</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm">Bảo hành chính hãng, dịch vụ sau bán hàng tận tâm</span>
                        </li>
                      </ul>
                    </div>

                    <h2 className="text-2xl font-bold mt-10 mb-4 text-white">Giới thiệu chi tiết</h2>
                    <p className="leading-relaxed">
                      Trong bối cảnh ngành công nghiệp phát triển mạnh mẽ, nhu cầu về thiết bị chuyên dụng
                      chất lượng cao ngày càng tăng. NEW ATLANTIC luôn đồng hành cùng khách hàng trong việc
                      lựa chọn và cung cấp những giải pháp thiết bị tối ưu nhất, phù hợp với từng nhu cầu cụ thể.
                    </p>

                    <h2 className="text-2xl font-bold mt-10 mb-4 text-white">Ứng dụng thực tế</h2>
                    <p className="leading-relaxed">
                      Các sản phẩm của chúng tôi được ứng dụng rộng rãi trong nhiều lĩnh vực: xây dựng, công nghiệp,
                      quốc phòng, an ninh, và nhiều ngành nghề khác. Với độ bền cao và hiệu suất vượt trội, thiết bị
                      của chúng tôi đã và đang được tin dùng bởi hàng nghìn khách hàng trên toàn quốc.
                    </p>

                    <h2 className="text-2xl font-bold mt-10 mb-4 text-white">Cam kết của chúng tôi</h2>
                    <p className="leading-relaxed">
                      NEW ATLANTIC cam kết mang đến cho khách hàng không chỉ là sản phẩm chất lượng mà còn là
                      dịch vụ hoàn hảo. Đội ngũ kỹ thuật viên được đào tạo bài bản, sẵn sàng tư vấn và hỗ trợ
                      khách hàng mọi lúc mọi nơi.
                    </p>
            </div>
          </div>

                {/* Share Section - Unique to News */}
                <ShareButtons title={post.title} />

                {/* Author Info - Unique to News */}
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                      NA
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2 text-white">NEW ATLANTIC</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        Đại lý chính thức và độc quyền các thương hiệu thiết bị công nghiệp hàng đầu thế giới.
                        Chuyên cung cấp giải pháp thiết bị chuyên dụng cho các dự án xây dựng, công nghiệp và quốc phòng.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">

              {/* Contact Card - Unique to News */}
              <div className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl shadow-xl border border-white/10">
                <h3 className="font-bold text-lg mb-3 text-white">Cần hỗ trợ?</h3>
                <p className="text-gray-400 mb-4 text-sm">
                  Liên hệ với chúng tôi để được tư vấn
                </p>
                <div className="space-y-2.5">
                  <a
                    href="tel:+842838733686"
                    className="flex items-center gap-2.5 text-blue-400 hover:text-blue-300 transition-colors group"
                  >
                    <div className="w-9 h-9 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Hotline</div>
                      <div className="font-semibold text-sm">+84 28 3873 3686</div>
                    </div>
                  </a>
                  <a
                    href="mailto:info@newatlantic.vn"
                    className="flex items-center gap-2.5 text-blue-400 hover:text-blue-300 transition-colors group"
                  >
                    <div className="w-9 h-9 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="font-semibold text-xs">info@newatlantic.vn</div>
                    </div>
                  </a>
                  <Link
                    href="/lien-he"
                    className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center px-4 py-2.5 rounded-lg font-bold hover:shadow-lg hover:scale-105 transition-all mt-3 text-sm"
                  >
                    Gửi yêu cầu tư vấn
                  </Link>
                </div>
            </div>
            </aside>
          </div>

          {/* Related Posts Slider */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <RelatedPostsSlider relatedPosts={relatedPosts} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

