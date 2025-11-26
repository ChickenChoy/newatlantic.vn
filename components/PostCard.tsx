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
    <TiltCard maxTilt={5} scale={1.02} className="h-full">
      <Link href={`/tin-tuc/${post.slug}`} className="h-full block">
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-200 hover:border-[#5f7ab8] h-full flex flex-col">
        {/* Image Section - Fixed Height */}
        <div className="relative h-40 bg-white overflow-hidden flex-shrink-0">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        
        {/* Content Section - Flex to fill remaining space */}
        <div className="p-4 flex flex-col flex-grow min-h-0">
          {/* Date - Fixed */}
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-2 flex-shrink-0">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {formattedDate}
          </div>
          
          {/* Title - Fixed height with line-clamp */}
          <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#5f7ab8] transition-colors leading-tight min-h-[2.5rem] flex-shrink-0">
            {post.title}
          </h3>
          
          {/* Excerpt - Flexible to fill space */}
          <div className="flex-1 min-h-0 mb-3">
            {post.excerpt ? (
              <p className="text-xs text-gray-700 line-clamp-2 leading-relaxed">{post.excerpt}</p>
            ) : (
              <div className="h-full"></div>
            )}
          </div>
          
          {/* Read More - Fixed at bottom */}
          <span className="inline-flex items-center gap-1.5 text-xs text-[#5f7ab8] font-semibold group-hover:gap-2 transition-all mt-auto flex-shrink-0">
            Đọc thêm 
            <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
      </Link>
    </TiltCard>
  );
}

