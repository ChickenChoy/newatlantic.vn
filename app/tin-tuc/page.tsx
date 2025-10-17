import PostCard from '@/components/PostCard';
import { posts } from '@/lib/data';
import Link from 'next/link';
import { generateMetadata, generateBreadcrumbSchema } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = generateMetadata({
  title: 'Tin tức & Sự kiện',
  description: 'Tin tức, sự kiện và bài viết mới nhất về thiết bị công nghiệp, máy móc công trình. Cập nhật thường xuyên về WILL-BURT, HIAB, LOVOL, LIUGONG và các công nghệ mới nhất trong ngành.',
  path: '/tin-tuc',
  keywords: [
    'tin tức thiết bị công nghiệp',
    'sự kiện NEW ATLANTIC',
    'tin tức WILL-BURT',
    'tin tức HIAB',
    'tin tức máy móc công trình',
    'triển lãm thiết bị',
    'công nghệ mới',
  ],
});

export default function NewsPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Trang chủ', url: '/' },
    { name: 'Tin tức', url: '/tin-tuc' },
  ]);

  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      {/* JSON-LD Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-[#e5e7eb] mt-6">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#5f7ab8] transition">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-[#5f7ab8] font-medium">Tin tức</span>
          </nav>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <div className="inline-block mb-3">
            <span className="px-4 py-1.5 bg-gradient-to-r from-[#63c9fe]/20 to-[#5f7ab8]/20 text-[#5f7ab8] rounded-full text-sm font-semibold border border-[#63c9fe]/30">
              TIN TỨC & SỰ KIỆN
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-5 bg-gradient-to-r from-[#63c9fe] via-[#5f7ab8] to-[#4a6199] bg-clip-text text-transparent">
            Tin Tức & Sự Kiện
          </h2>
          <div className="flex items-center justify-center gap-2 mb-5">
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#63c9fe]/50 to-[#63c9fe]"></div>
            <div className="w-2 h-2 bg-[#63c9fe] rounded-full animate-pulse"></div>
            <div className="w-20 h-0.5 bg-gradient-to-l from-transparent via-[#63c9fe]/50 to-[#63c9fe]"></div>
          </div>
          <p className="text-gray-600 text-base">
            Tìm thấy <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 bg-gradient-to-r from-[#63c9fe] to-[#5f7ab8] text-white rounded-lg font-bold text-sm mx-1">{posts.length}</span> bài viết
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

