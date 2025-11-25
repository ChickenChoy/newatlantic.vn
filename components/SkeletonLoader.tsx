'use client';

export function ProductCardSkeleton() {
  return (
    <div className="w-full h-full animate-pulse">
      {/* Background - matching ProductCard style */}
      <div 
        className="relative w-full h-full bg-gray-200 rounded-[40px_150px_40px_40px]"
        style={{ minHeight: '450px' }}
      >
        {/* Image Container */}
        <div 
          className="relative w-full bg-gray-300"
          style={{ 
            padding: '60px 35px 30px',
            height: '240px'
          }}
        />
        
        {/* Title Box */}
        <div 
          className="relative"
          style={{ 
            padding: '0 35px 45px'
          }}
        >
          {/* Separator */}
          <div className="h-1.5 bg-gray-300 rounded-full mb-5 w-12"></div>
          {/* Product Name */}
          <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
          {/* Category */}
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      <div className="aspect-video bg-gray-200"></div>
      <div className="p-6 space-y-4">
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        <div className="h-5 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
      <div className="flex flex-wrap" style={{ margin: '0 -16px' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-full md:w-1/2 lg:w-1/3 px-4" style={{ marginBottom: '32px' }}>
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TextSkeleton({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-gray-200 rounded animate-pulse ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
        ></div>
      ))}
    </div>
  );
}

export function SkeletonLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-gray-200 rounded animate-pulse ${className}`}></div>
  );
}

