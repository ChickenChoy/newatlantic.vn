import PostCard from '@/components/PostCard';
import { posts } from '@/lib/data';
import Link from 'next/link';

export const metadata = {
  title: 'Tin tức & Sự kiện - NEW ATLANTIC',
  description: 'Tin tức, sự kiện và bài viết mới nhất về thiết bị công nghiệp',
};

export default function NewsPage() {
  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-[#e5e7eb]">
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
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-2">Tin Tức & Sự Kiện</h2>
          <p className="text-gray-600 text-lg">Tìm thấy <span className="font-semibold text-[#5f7ab8]">{posts.length}</span> bài viết</p>
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

