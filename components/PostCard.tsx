import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types';
import { TiltCard } from './micro-interactions';

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
    <TiltCard maxTilt={3} scale={1.02} className="h-full">
      <Link href={`/tin-tuc/${post.slug}`} className="h-full block group">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
          {/* Image Section */}
          <div className="relative h-52 bg-white/5 overflow-hidden flex-shrink-0">
            {post.image ? (
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* Date Badge */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
              {formattedDate}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>

          {/* Content Section */}
          <div className="p-6 flex flex-col flex-grow">
            {/* Category Tag */}
            <div className="mb-3">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                {post.category || 'Tin tuc'}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-orange-400 transition-colors leading-snug">
              {post.title}
            </h3>

            {/* Excerpt */}
            <div className="flex-1 min-h-0 mb-4">
              {post.excerpt ? (
                <p className="text-sm text-gray-300 line-clamp-3 leading-relaxed">{post.excerpt}</p>
              ) : (
                <div className="h-full"></div>
              )}
            </div>

            {/* Read More Link */}
            <div className="flex items-center gap-2 text-sm font-semibold text-white group-hover:text-orange-400 transition-colors mt-auto pt-4 border-t border-white/10">
              Đọc chi tiết
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}

