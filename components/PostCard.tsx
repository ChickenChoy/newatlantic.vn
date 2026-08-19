import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link
      href={`/tin-tuc/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-navy/14 bg-background transition-colors duration-300 ease-brand hover:border-navy/30"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-surface">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[400ms] ease-brand group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-navy/14">
            <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Date pill */}
        <span className="absolute left-4 top-4 rounded-pill border border-navy/14 bg-background px-4 py-2 text-xs font-medium leading-none text-navy">
          {formattedDate}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-grow flex-col p-6 md:p-8">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-accent">
          {post.category || 'Tin tức'}
        </p>

        <h3 className="font-display text-d6 uppercase leading-display tracking-display text-navy transition-colors duration-300 ease-brand group-hover:text-accent">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="mt-4 line-clamp-3 text-sm leading-[1.6] text-ink">{post.excerpt}</p>
        )}

        <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-navy transition-colors duration-300 ease-brand group-hover:text-accent">
          Đọc chi tiết
          <svg
            className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
