'use client';

import { Suspense, useState, useMemo, useEffect } from 'react';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import Image from 'next/image';
import { generateBreadcrumbSchema } from '@/lib/seo';
import Pagination from '@/components/Pagination';
import { PostCardSkeleton } from '@/components/SkeletonLoader';
import { useSearchParams, useRouter } from 'next/navigation';
import HolidayBanner from '@/components/HolidayBanner';
import EmptyState from '@/components/EmptyState';
import { PageHero, Section, CTABand, ArrowButton } from '@/components/sections';
import Reveal from '@/components/motion/Reveal';
import type { Post, PostCategory } from '@/types';

const ITEMS_PER_PAGE = 9;

// Fallback categories in case API fails
const FALLBACK_CATEGORIES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'tin-tuc', label: 'Tin tức' },
  { id: 'su-kien', label: 'Sự kiện' },
];

function normalizeCategoryKey(value?: string | null): string {
  if (!value) return '';

  return value
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u0111\u0110]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Lead article — the template's oversized blog hero card: full-bleed photo,
 * navy scrim, condensed display headline sitting on the bottom edge.
 */
function FeaturedPost({ post }: { post: Post }) {
  if (!post) return null;

  const formattedDate = new Date(post.date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/tin-tuc/${post.slug}`} className="group mb-12 block">
      <div className="relative h-[420px] w-full overflow-hidden rounded-card bg-navy md:h-[520px]">
        {/* Background image + navy scrim */}
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 1199px) 100vw, 1200px"
            className="object-cover transition-transform duration-700 ease-brand group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface">
            <span className="text-sm text-muted">Không có ảnh</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/10" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 lg:p-12">
          <div className="max-w-3xl">
            <div className="mb-5 flex flex-wrap items-center gap-4">
              <span className="rounded-pill bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                Mới nhất
              </span>
              <span className="flex items-center gap-2 text-sm text-white/60">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formattedDate}
              </span>
            </div>

            <h2 className="font-display text-d4 uppercase leading-display tracking-display text-white transition-colors duration-300 ease-brand group-hover:text-accent">
              {post.title}
            </h2>

            {post.excerpt && (
              <p className="mt-5 line-clamp-2 max-w-2xl text-base leading-[1.6] text-white/80 md:line-clamp-3">
                {post.excerpt}
              </p>
            )}

            <span className="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-white">
              Đọc tiếp
              <svg
                className="h-4 w-4 text-accent transition-transform duration-300 ease-brand group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
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
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const router = useRouter();
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const [activeCategory, setActiveCategory] = useState('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<{ id: string; label: string }[]>(FALLBACK_CATEGORIES);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [disabledCategoryKeys, setDisabledCategoryKeys] = useState<string[]>([]);

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
          // Store disabled category keys for filtering posts (supports both slug + name values in DB posts)
          const disabledKeys = categoriesData
            .filter(cat => !cat.enabled)
            .flatMap(cat => [normalizeCategoryKey(cat.slug), normalizeCategoryKey(cat.name)])
            .filter(Boolean);
          setDisabledCategoryKeys(Array.from(new Set(disabledKeys)));

          // Transform to the format used by the filter and filter out disabled categories.
          // Always keep the "all" tab as the first tab.
          const enabledCategories = categoriesData
            .filter(cat => cat.enabled)
            .sort((a, b) => a.order - b.order)
            .map(cat => ({
              id: normalizeCategoryKey(cat.slug || cat.name),
              label: cat.name
            }))
            .filter(cat => cat.id && cat.id !== 'all');

          setCategories([{ id: 'all', label: FALLBACK_CATEGORIES[0]?.label || 'All' }, ...enabledCategories]);
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
      const postCategoryKey = normalizeCategoryKey(
        (post as any).category || (post as any).categoryName || (post as any).category_name
      );
      if (postCategoryKey && disabledCategoryKeys.includes(postCategoryKey)) return false;
      return true;
    });
    if (activeCategory !== 'all') {
      const selectedCategory = categories.find(cat => cat.id === activeCategory);
      const activeKey = normalizeCategoryKey(activeCategory);
      const activeLabelKey = normalizeCategoryKey(selectedCategory?.label);

      result = result.filter(post => {
        const postKeys = [
          normalizeCategoryKey((post as any).category),
          normalizeCategoryKey((post as any).categoryName),
          normalizeCategoryKey((post as any).category_name),
        ].filter(Boolean);

        if (activeKey === 'tin-tuc' && postKeys.length === 0) {
          return true;
        }

        return postKeys.includes(activeKey) || (activeLabelKey ? postKeys.includes(activeLabelKey) : false);
      });
    }
    // Sort by date (newest first)
    return result.sort((a: Post, b: Post) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [activeCategory, posts, disabledCategoryKeys, categories]);

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

  if (isLoadingPosts) {
    return <NewsPageFallback />;
  }

  return (
    <>
      {/* Category filter — pill tabs on the template's rhythm */}
      <div className="mb-10 border-b border-navy/14 pb-6">
        <div className="scrollbar-hide overflow-x-auto py-1">
          <div className="flex min-w-max items-center gap-2 px-px md:gap-3">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  aria-pressed={isActive}
                  className={`rounded-pill px-5 py-2.5 text-sm font-medium transition-colors duration-300 ease-brand focus:outline-none ${
                    isActive
                      ? 'bg-navy font-semibold text-white'
                      : 'border border-navy/14 bg-surface text-ink hover:border-navy hover:text-navy'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Featured Post (Only on first page of 'All') */}
      {featuredPost && (
        <Reveal>
          <FeaturedPost post={featuredPost} />
        </Reveal>
      )}

      {/* Posts Grid */}
      {displayPosts.length > 0 && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {displayPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {displayPosts.length === 0 && !featuredPost && (
        <EmptyState
          title="Không tìm thấy bài viết"
          description="Chưa có bài viết nào trong danh mục này. Hãy thử một danh mục khác hoặc quay lại sau."
          actionLabel="Xem tất cả tin tức"
          actionHref="/tin-tuc"
        />
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
      <div className="h-[420px] animate-pulse rounded-card border border-navy/14 bg-surface md:h-[520px]" />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
    <>
      {/* JSON-LD Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <PageHero
        eyebrow="Tin tức & Sự kiện"
        title="Tin tức New Atlantic"
        image="/images/place-holder/excavator-construction.jpg"
        intro="Cập nhật công nghệ thiết bị nâng hạ, cột nâng viễn thông, dự án đã triển khai và hoạt động nổi bật của Tân Đại Tây Dương."
        breadcrumbs={[{ name: 'Trang chủ', href: '/' }, { name: 'Tin tức' }]}
      />

      {/* Holiday banner — collapses on days with no active holiday effect */}
      <div className="mx-auto flex w-full max-w-site justify-center px-5 py-12 md:px-gutter empty:hidden">
        <HolidayBanner variant="minimal" />
      </div>

      <Section>
        <Suspense fallback={<NewsPageFallback />}>
          <NewsPageContent />
        </Suspense>
      </Section>

      <CTABand
        eyebrow="Cần tư vấn thiết bị?"
        title="Nói với chúng tôi về công trình của bạn"
        intro="Kỹ sư New Atlantic khảo sát hiện trường, đề xuất cấu hình và báo giá trong 24 giờ làm việc."
        actions={
          <>
            <ArrowButton href="/lien-he" variant="accent">
              Liên hệ ngay
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
