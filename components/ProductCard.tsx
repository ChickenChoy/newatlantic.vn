import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/san-pham/${product.categorySlug}/${product.slug}`} className="h-full">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-[#5f7ab8] h-full flex flex-col relative">
        <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          {product.image ? (
            <>
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                quality={95}
                priority={false}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
              <svg className="w-20 h-20 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Featured Badge */}
          {product.featured && (
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Nổi bật
              </div>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
              {product.category}
            </div>
          </div>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="font-bold text-xl text-gray-900 line-clamp-2 mb-3 group-hover:text-[#5f7ab8] transition-colors leading-tight min-h-[3.5rem]">
            {product.name}
          </h3>
          
          {product.description && (
            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-4 min-h-[2.5rem]">
              {product.description}
            </p>
          )}

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4"></div>

          {/* View Details Button */}
          <div className="flex items-center justify-between mt-auto">
            <span className="inline-flex items-center gap-2 text-[#5f7ab8] font-bold text-sm group-hover:gap-3 transition-all">
              Xem chi tiết
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
            
            {/* Stock Status */}
            <div className="flex items-center gap-1.5 text-green-600 text-xs font-semibold">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Còn hàng</span>
            </div>
          </div>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 border-2 border-[#5f7ab8] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      </div>
    </Link>
  );
}

