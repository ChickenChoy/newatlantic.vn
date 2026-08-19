'use client';

import { useEffect, useState, useCallback } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import ShareButtons from '@/components/ShareButtons';
import RelatedPostsSlider from '@/components/RelatedPostsSlider';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import TableOfContents from '@/components/TableOfContents';
import EstimatedReadingTime from '@/components/EstimatedReadingTime';
import { PageHero, Section, CTABand, ArrowButton } from '@/components/sections';
import { sanitizeHtmlContent } from '@/lib/textUtils';
import type { Post } from '@/types';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/** Article body typography, tuned to the template's light palette. */
const PROSE_CLASS = `prose max-w-none prose-base lg:prose-lg
  prose-headings:font-display prose-headings:uppercase prose-headings:tracking-display prose-headings:text-navy
  prose-p:text-ink prose-p:leading-[1.6]
  prose-strong:text-navy prose-strong:font-semibold
  prose-ul:text-ink prose-ol:text-ink prose-li:text-ink
  prose-blockquote:border-l-accent prose-blockquote:text-navy prose-blockquote:not-italic
  prose-a:text-accent prose-a:no-underline hover:prose-a:underline
  prose-img:rounded-card`;

/** Trust points shown beside every article. */
const HIGHLIGHTS = [
  'Sản phẩm chính hãng, nhập khẩu trực tiếp từ nhà sản xuất',
  'Hỗ trợ kỹ thuật chuyên nghiệp 24/7 trên toàn quốc',
  'Bảo hành chính hãng, dịch vụ sau bán hàng tận tâm',
];

export default function PostPage({ params }: PostPageProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string>('');

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    };
    loadParams();
  }, [params]);

  const loadPost = useCallback(async () => {
    if (!slug) return;

    try {
      const res = await fetch('/api/posts');
      if (!res.ok) throw new Error('Failed to fetch posts');

      const posts: Post[] = await res.json();
      const foundPost = posts.find(p => p.slug === slug);

      if (!foundPost) {
        notFound();
        return;
      }

      setPost(foundPost);

      // Get related posts (excluding current)
      const related = posts.filter(p => p.id !== foundPost.id).slice(0, 6);
      setRelatedPosts(related);

      // Update page title
      document.title = `${foundPost.title} | NEW ATLANTIC - Tân Đại Tây Dương`;
    } catch (error) {
      console.error('Error loading post:', error);
      notFound();
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  // Add IDs to headings for TOC
  useEffect(() => {
    if (!post) return;

    const addHeadingIds = () => {
      const content = document.querySelector('.prose');
      if (!content) return;

      const headings = content.querySelectorAll('h2, h3');
      headings.forEach((heading, index) => {
        if (!heading.id) {
          heading.id = `heading-${index}`;
        }
      });
    };

    const timer = setTimeout(addHeadingIds, 100);
    return () => clearTimeout(timer);
  }, [post]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background pt-32">
        <div className="h-12 w-12 animate-spin rounded-pill border-2 border-navy/14 border-t-accent" />
      </div>
    );
  }

  if (!post) {
    notFound();
    return null;
  }

  const formattedDate = new Date(post.date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      {/* Reading Progress Bar */}
      <ReadingProgressBar />

      <PageHero
        eyebrow="Tin tức & Sự kiện"
        title={post.title}
        image={post.image || '/images/place-holder/excavator-construction.jpg'}
        breadcrumbs={[
          { name: 'Trang chủ', href: '/' },
          { name: 'Tin tức', href: '/tin-tuc' },
          { name: post.title },
        ]}
        footer={
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-white/60">
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formattedDate}
            </span>
            {post.author && (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {post.author}
              </span>
            )}
            <EstimatedReadingTime />
          </div>
        }
      />

      <Section>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4 lg:gap-12">
          {/* Main Content */}
          <article className="lg:col-span-3">
            {/* Featured Image */}
            {post.image && (
              <div className="relative mb-12 aspect-[16/9] w-full overflow-hidden rounded-card bg-surface">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 880px"
                  className="object-cover"
                />
              </div>
            )}

            {/* Lead paragraph */}
            {post.excerpt && (
              <p className="mb-10 border-l-2 border-accent pl-6 text-lg leading-[1.6] text-navy md:text-xl">
                {post.excerpt}
              </p>
            )}

            {/* Post Content */}
            <div
              className={PROSE_CLASS}
              dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(post.content) }}
            />

            {/* Standing brand context — shown under every article */}
            <div className="mt-16 space-y-6 border-t border-navy/14 pt-12">
              <h2 className="font-display text-d5 uppercase leading-display tracking-display text-navy">
                Về NEW ATLANTIC
              </h2>
              <p className="text-base leading-[1.6] text-ink">
                NEW ATLANTIC là đại lý chính thức tại Việt Nam của các thương hiệu thiết bị công nghiệp
                hàng đầu — WILL-BURT, HIAB, SKYMARK, LOVOL và EFFER. Hơn 22 năm hoạt động, chúng tôi
                cung cấp cột nâng viễn thông, cẩu tự hành, thiết bị nâng hạ cùng giải pháp phòng cháy
                chữa cháy và điện công nghiệp cho các dự án trên toàn quốc.
              </p>

              <div className="rounded-card border border-navy/14 bg-surface p-8">
                <h3 className="font-display text-d6 uppercase leading-display tracking-display text-navy">
                  Điểm nổi bật
                </h3>
                <ul className="mt-6 space-y-4">
                  {HIGHLIGHTS.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <svg className="mt-0.5 h-5 w-5 shrink-0 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm leading-[1.6] text-ink">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-base leading-[1.6] text-ink">
                Thiết bị của chúng tôi được ứng dụng trong xây dựng, công nghiệp, viễn thông, quốc phòng
                và an ninh. Đội ngũ kỹ sư khảo sát hiện trường, lắp đặt, nghiệm thu và bảo trì định kỳ —
                đồng hành cùng công trình sau khi bàn giao.
              </p>
            </div>

            {/* Share Section */}
            <ShareButtons title={post.title} />

            {/* Author Info */}
            <div className="mt-12 rounded-card border border-navy/14 bg-surface p-8">
              <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-pill bg-navy font-display text-xl uppercase tracking-display text-white">
                  NA
                </span>
                <div>
                  <h3 className="font-display text-d6 uppercase leading-display tracking-display text-navy">
                    NEW ATLANTIC
                  </h3>
                  <p className="mt-3 text-sm leading-[1.6] text-ink">
                    Tân Đại Tây Dương — nhà phân phối thiết bị công nghiệp, cột nâng viễn thông và
                    giải pháp nâng hạ chuyên dụng cho dự án xây dựng, công nghiệp và quốc phòng.
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar with TOC */}
          <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
            {/* Table of Contents */}
            <TableOfContents />

            {/* Contact Card */}
            <div className="rounded-card bg-navy p-8">
              <h3 className="font-display text-d6 uppercase leading-display tracking-display text-white">
                Cần hỗ trợ?
              </h3>
              <p className="mt-3 text-sm leading-[1.6] text-white/60">
                Kỹ sư của chúng tôi sẵn sàng tư vấn cấu hình thiết bị phù hợp với công trình của bạn.
              </p>

              <div className="mt-6 space-y-3">
                <a
                  href="tel:+842838733686"
                  className="group flex items-center gap-3 rounded-card border border-white/14 p-3 transition-colors duration-300 ease-brand hover:border-accent"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-white/14 text-accent transition-colors duration-300 ease-brand group-hover:bg-accent group-hover:text-white">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.21l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs uppercase tracking-[0.14em] text-white/60">Hotline</span>
                    <span className="block break-words text-sm font-semibold text-white">+84 28 3873 3686</span>
                  </span>
                </a>

                <a
                  href="mailto:info@newatlantic.vn"
                  className="group flex items-center gap-3 rounded-card border border-white/14 p-3 transition-colors duration-300 ease-brand hover:border-accent"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-white/14 text-accent transition-colors duration-300 ease-brand group-hover:bg-accent group-hover:text-white">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </span>
                  {/*
                    `min-w-0` + `break-words`: this sidebar column is 264px wide
                    on every desktop (the grid is 4-col inside a 1200px cap), which
                    leaves ~126px for the text once the card padding, row padding,
                    icon and gap are subtracted. "info@newatlantic.vn" is a single
                    unbreakable token far wider than that, and as a flex child with
                    the default `min-width: auto` it refused to shrink — so it ran
                    straight through the row's border and out of the navy card.
                  */}
                  <span className="min-w-0">
                    <span className="block text-xs uppercase tracking-[0.14em] text-white/60">Email</span>
                    <span className="block break-words text-sm font-semibold text-white">info@newatlantic.vn</span>
                  </span>
                </a>
              </div>

              <div className="mt-6">
                <ArrowButton href="/lien-he" variant="accent" full>
                  Gửi yêu cầu tư vấn
                </ArrowButton>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {/* Related Posts Slider */}
      {relatedPosts.length > 0 && (
        <Section tone="surface">
          <RelatedPostsSlider relatedPosts={relatedPosts} />
        </Section>
      )}

      <CTABand
        eyebrow="Bắt đầu dự án của bạn"
        title="Thiết bị phù hợp, đúng tiến độ"
        intro="Gửi yêu cầu để nhận khảo sát hiện trường và báo giá từ kỹ sư New Atlantic trong 24 giờ làm việc."
        actions={
          <>
            <ArrowButton href="/lien-he" variant="accent">
              Liên hệ tư vấn
            </ArrowButton>
            <ArrowButton href="/tin-tuc" variant="outline-light">
              Xem thêm tin tức
            </ArrowButton>
          </>
        }
      />
    </>
  );
}
