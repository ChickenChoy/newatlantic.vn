import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/san-pham/${product.categorySlug}/${product.slug}`} className="h-full">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-200 hover:border-gray-300 h-full flex flex-col relative">
        <div className="relative h-64 bg-gray-50 overflow-hidden">
          {product.image ? (
            <>
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                quality={95}
                priority={false}
              />
              {/* Subtle Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
              <svg className="w-20 h-20 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Featured Badge */}
          {product.featured && (
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-md flex items-center gap-1.5">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Nổi bật
              </div>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute bottom-4 right-4 z-10">
            <span className="bg-white/95 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
              {product.category}
            </span>
          </div>
        </div>
        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mb-4 line-clamp-3 flex-1">
            {product.description}
          </p>
          
          {/* View Details Button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-sm font-medium text-gray-900 group-hover:text-[#5f7ab8] transition-colors">
              Xem chi tiết
            </span>
            <svg 
              className="w-5 h-5 text-gray-400 group-hover:text-[#5f7ab8] group-hover:translate-x-1 transition-all" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

