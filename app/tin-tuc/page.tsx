'use client';

import { Suspense, useState, useMemo } from 'react';
import PostCard from '@/components/PostCard';
import { posts } from '@/lib/data';
import Link from 'next/link';
import { generateBreadcrumbSchema } from '@/lib/seo';
import Pagination from '@/components/Pagination';
import { PostCardSkeleton } from '@/components/SkeletonLoader';
import { useSearchParams, useRouter } from 'next/navigation';

const ITEMS_PER_PAGE = 9;

function NewsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const [filter, setFilter] = useState<string>('all');

  // Filter posts
  const filteredPosts = useMemo(() => {
    if (filter === 'all') return posts;
    return posts.filter(post => 
      post.category?.toLowerCase().includes(filter.toLowerCase()) ||
      post.title.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter]);

  // Sort by date (newest first)
  const sortedPosts = useMemo(() => {
    return [...filteredPosts].sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();
      return dateB - dateA;
    });
  }, [filteredPosts]);

  // Pagination
  const totalPages = Math.ceil(sortedPosts.length / ITEMS_PER_PAGE);
  const validPage = Math.min(Math.max(1, page), totalPages || 1);
  const validStartIdx = (validPage - 1) * ITEMS_PER_PAGE;
  const validEndIdx = validStartIdx + ITEMS_PER_PAGE;
  const paginatedPosts = sortedPosts.slice(validStartIdx, validEndIdx);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    router.push('/tin-tuc?page=1');
  };

  const categories = ['all', 'WILL-BURT', 'HIAB', 'LOVOL', 'LIUGONG', 'Tin tức', 'Sự kiện'];

  return (
    <>
      {/* Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-sm text-gray-600">
          Hiển thị <span className="font-semibold text-[#5f7ab8]">{sortedPosts.length}</span> bài viết
        </div>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilterChange(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === cat
                  ? 'bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-[#5f7ab8] hover:bg-gray-50'
              }`}
            >
              {cat === 'all' ? 'Tất cả' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {paginatedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Empty State */}
      {paginatedPosts.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
          <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <p className="text-gray-500 text-xl font-medium mb-2">Không tìm thấy bài viết</p>
          <p className="text-gray-400 text-sm">Thử chọn danh mục khác</p>
        </div>
      )}

      {/* Pagination */}
      {paginatedPosts.length > 0 && (
        <Pagination
          currentPage={validPage}
          totalPages={totalPages}
          totalItems={sortedPosts.length}
          itemsPerPage={ITEMS_PER_PAGE}
          baseUrl="/tin-tuc"
        />
      )}
    </>
  );
}

function NewsPageFallback() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
      {[...Array(9)].map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}

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
      <div className="bg-gray-50 mt-4">
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

      {/* Posts Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Tin Tức & Sự Kiện
          </h2>
          <p className="text-sm text-gray-600">
            Cập nhật tin tức mới nhất về thiết bị công nghiệp và công nghệ
          </p>
        </div>

        <Suspense fallback={<NewsPageFallback />}>
          <NewsPageContent />
        </Suspense>
      </div>
    </div>
  );
}

