import PostCard from '@/components/PostCard';
import { posts } from '@/lib/data';

export const metadata = {
  title: 'Tin tức & Sự kiện - NEW AIT',
  description: 'Tin tức, sự kiện và bài viết mới nhất về thiết bị công nghiệp',
};

export default function NewsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-[#5f7ab8] via-[#4a6199] to-[#3a4d7a] text-white pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl -top-48 -right-48"></div>
          <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl -bottom-48 -left-48"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl font-bold mb-4">Tin Tức & Sự Kiện</h1>
          <p className="text-xl text-gray-100">
            Cập nhật tin tức, sự kiện và kiến thức mới nhất về thiết bị công nghiệp
          </p>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-2">Tất cả bài viết</h2>
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

