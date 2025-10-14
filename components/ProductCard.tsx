import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/san-pham/${product.categorySlug}/${product.slug}`} className="h-full">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-[#5f7ab8] h-full flex flex-col">
        <div className="relative h-48 bg-white overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {product.featured && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
              ⭐ Nổi bật
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <span className="inline-block w-fit text-xs text-[#5f7ab8] font-bold bg-[#5f7ab8]/10 px-3 py-1 rounded-full mb-3">
            {product.category}
          </span>
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#5f7ab8] transition-colors">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
          )}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
            <span className="text-[#5f7ab8] font-bold text-lg">{product.price || 'Liên hệ'}</span>
            <span className="text-sm text-[#5f7ab8] font-semibold group-hover:gap-2 flex items-center gap-1 transition-all">
              Xem chi tiết 
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

