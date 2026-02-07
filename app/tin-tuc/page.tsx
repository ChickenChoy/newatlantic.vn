'use client';

import { Suspense, useState, useMemo, useEffect } from 'react';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import Image from 'next/image';
import { generateBreadcrumbSchema } from '@/lib/seo';
import Pagination from '@/components/Pagination';
import { PostCardSkeleton } from '@/components/SkeletonLoader';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import HolidayBanner from '@/components/HolidayBanner';
import type { Post, PostCategory } from '@/types';

const ITEMS_PER_PAGE = 9;

// Fallback categories in case API fails
const FALLBACK_CATEGORIES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'tin-tuc', label: 'Tin tức' },
  { id: 'su-kien', label: 'Sự kiện' },
];

function FeaturedPost({ post }: { post: Post }) {
  if (!post) return null;

  const formattedDate = new Date(post.date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/tin-tuc/${post.slug}`} className="group block mb-12 relative">
      <div className="relative h-[400px] md:h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">Không có ảnh</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 lg:p-12 text-white">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-orange-600 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                Mới nhất
              </span>
              <span className="text-sm text-gray-300 font-medium flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formattedDate}
              </span>
            </div>

            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight group-hover:text-orange-400 transition-colors">
              {post.title}
            </h2>

            <p className="text-gray-300 text-base md:text-lg line-clamp-2 md:line-clamp-3 mb-6 max-w-2xl">
              {post.excerpt}
            </p>

            <span className="inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:gap-3 transition-all">
              Đọc tiếp
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function NewsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const [activeCategory, setActiveCategory] = useState('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<{ id: string; label: string }[]>(FALLBACK_CATEGORIES);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [disabledCategoryNames, setDisabledCategoryNames] = useState<string[]>([]);

  // Fetch posts and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, categoriesRes] = await Promise.all([
          fetch('/api/posts'),
          fetch('/api/post-categories')
        ]);

        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setPosts(postsData);
        }

        if (categoriesRes.ok) {
          const categoriesData: PostCategory[] = await categoriesRes.json();
          // Store disabled category names for filtering posts
          const disabledNames = categoriesData
            .filter(cat => !cat.enabled)
            .map(cat => cat.name.toLowerCase());
          setDisabledCategoryNames(disabledNames);
          // Transform to the format used by the filter and filter out disabled categories
          const enabledCategories = categoriesData
            .filter(cat => cat.enabled)
            .sort((a, b) => a.order - b.order)
            .map(cat => ({ id: cat.slug, label: cat.name }));
          if (enabledCategories.length > 0) {
            setCategories(enabledCategories);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoadingPosts(false);
      }
    };
    fetchData();
  }, []);

  // Filter posts
  const filteredPosts = useMemo(() => {
    // First filter out disabled posts and posts in disabled categories
    let result = posts.filter(post => {
      if ((post as any).enabled === false) return false;
      if (post.category && disabledCategoryNames.includes(post.category.toLowerCase())) return false;
      return true;
    });
    if (activeCategory !== 'all') {
      result = result.filter(post =>
        post.category?.toLowerCase().includes(activeCategory.toLowerCase()) ||
        post.title.toLowerCase().includes(activeCategory.toLowerCase())
      );
    }
    // Sort by date (newest first)
    return result.sort((a: Post, b: Post) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [activeCategory, posts, disabledCategoryNames]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const validPage = Math.min(Math.max(1, page), totalPages || 1);
  const validStartIdx = (validPage - 1) * ITEMS_PER_PAGE;
  const validEndIdx = validStartIdx + ITEMS_PER_PAGE;

  // Get featured post (first one) and remaining posts
  const featuredPost = activeCategory === 'all' && validPage === 1 ? filteredPosts[0] : null;
  const displayPosts = featuredPost
    ? filteredPosts.slice(1, ITEMS_PER_PAGE + 1) // If featured exists, show next items
    : filteredPosts.slice(validStartIdx, validEndIdx); // Otherwise show normal page

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    router.push('/tin-tuc?page=1', { scroll: false });
  };

  return (
    <>
      {/* Category Filter + Tet Banner Row */}
      <div className="mb-6 md:mb-10">
        {/* Category Filter Tabs */}
        <div className="overflow-x-auto py-2 scrollbar-hide">
          <div className="flex items-center gap-2 md:gap-3 min-w-max px-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`
                  px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none
                  ${activeCategory === cat.id
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30 scale-105'
                    : 'bg-white/10 text-gray-300 hover:bg-white/15 border border-white/10 hover:border-orange-400/50'
                  }
                `}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Post (Only on first page of 'All') */}
      {featuredPost && <FeaturedPost post={featuredPost} />}

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Empty State */}
      {displayPosts.length === 0 && (
        <div className="text-center py-24 bg-white/10 backdrop-blur-sm rounded-3xl border border-dashed border-white/20">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Không tìm thấy bài viết</h3>
          <p className="text-gray-400">Thử chọn danh mục khác hoặc quay lại sau</p>
        </div>
      )}

      {/* Pagination */}
      {filteredPosts.length > (featuredPost ? ITEMS_PER_PAGE + 1 : ITEMS_PER_PAGE) && (
        <div className="mt-12">
          <Pagination
            currentPage={validPage}
            totalPages={totalPages}
            totalItems={filteredPosts.length}
            itemsPerPage={ITEMS_PER_PAGE}
            baseUrl="/tin-tuc"
          />
        </div>
      )}
    </>
  );
}

function NewsPageFallback() {
  return (
    <div className="space-y-8">
      <div className="h-[400px] bg-gray-100 rounded-3xl animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default function NewsPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Trang chủ', url: '/' },
    { name: 'Tin tức', url: '/tin-tuc' },
  ]);

  return (
    <div className="bg-[#050c3a] min-h-screen pt-24 sm:pt-28 md:pt-32 relative overflow-hidden">

      {/* JSON-LD Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Header Section */}
      <div className="relative z-10 border-b border-white/10">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
              Tin tức & Sự kiện
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Tin tức & <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">Sự kiện</span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto mb-8">
              Cập nhật những thông tin mới nhất về công nghệ, sản phẩm và các hoạt động nổi bật của New Atlantic.
            </p>

            {/* Holiday Banner - Centered Minimal */}
            <div className="flex justify-center">
              <HolidayBanner variant="minimal" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <Suspense fallback={<NewsPageFallback />}>
          <NewsPageContent />
        </Suspense>
      </div>
    </div>
  );
}
