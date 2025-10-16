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
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] bg-clip-text text-transparent">
            Tin Tức & Sự Kiện
          </h2>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent to-[#5f7ab8]"></div>
            <div className="w-2 h-2 bg-[#5f7ab8] rounded-full"></div>
            <div className="w-16 h-1 bg-gradient-to-l from-transparent to-[#5f7ab8]"></div>
          </div>
          <p className="text-gray-600 text-lg">Tìm thấy <span className="font-bold text-[#5f7ab8] text-xl">{posts.length}</span> bài viết</p>
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

