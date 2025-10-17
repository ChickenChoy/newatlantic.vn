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
    <div className="bg-gray-50 min-h-screen pt-16">
      {/* JSON-LD Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-t border-[#e5e7eb] mt-4">
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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Tin Tức & Sự Kiện
          </h2>
          <p className="text-sm text-gray-600">
            {posts.length} bài viết
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

