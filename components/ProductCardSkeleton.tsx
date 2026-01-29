'use client';

interface ProductCardSkeletonProps {
    className?: string;
}

export default function ProductCardSkeleton({ className = '' }: ProductCardSkeletonProps) {
    return (
        <div className={`block relative h-full ${className}`}>
            {/* Background skeleton */}
            <div
                className="absolute rounded-2xl overflow-hidden"
                style={{
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
            />

            {/* Image skeleton */}
            <div className="relative w-full pt-12 pb-6 px-6 md:pt-[60px] md:pb-[30px] md:px-[35px]" style={{ zIndex: 20 }}>
                <div className="relative w-full aspect-[4/3] min-h-[160px] max-h-[160px] md:min-h-[240px] md:max-h-[240px]">
                    <div
                        className="absolute inset-0 rounded-lg animate-pulse"
                        style={{
                            background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 100%)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 1.5s infinite'
                        }}
                    />
                </div>
            </div>

            {/* Content skeleton */}
            <div className="relative px-6 pb-8 md:px-[35px] md:pb-[45px]" style={{ zIndex: 15 }}>
                {/* Separator skeleton */}
                <div
                    className="w-10 h-1 md:w-[60px] md:h-[5px] mb-4 md:mb-5 rounded animate-pulse"
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                />

                {/* Title skeleton */}
                <div
                    className="h-6 md:h-7 rounded mb-2 md:mb-2.5 animate-pulse"
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        width: '85%'
                    }}
                />
                <div
                    className="h-4 md:h-5 rounded animate-pulse"
                    style={{
                        background: 'rgba(255,255,255,0.08)',
                        width: '60%'
                    }}
                />

                {/* Category skeleton */}
                <div className="flex items-center gap-2 mt-3">
                    <div
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ background: 'rgba(255,255,255,0.1)' }}
                    />
                    <div
                        className="h-3 md:h-4 rounded animate-pulse"
                        style={{
                            background: 'rgba(255,255,255,0.06)',
                            width: '40%'
                        }}
                    />
                </div>
            </div>

            {/* CSS for shimmer animation */}
            <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
        </div>
    );
}

// Grid skeleton for product listing
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}
