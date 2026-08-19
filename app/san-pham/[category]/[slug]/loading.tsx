import { ProductCardSkeleton } from '@/components/SkeletonLoader';

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb Skeleton */}
          <div className="mb-6 animate-pulse">
            <div className="h-3 w-48 rounded-pill bg-navy/14" />
          </div>

          {/* Main Content Grid */}
          <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Image Gallery Skeleton */}
            <div className="space-y-4">
              <div className="aspect-square animate-pulse rounded-card border border-navy/14 bg-surface" />
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square animate-pulse rounded-card border border-navy/14 bg-surface"
                  />
                ))}
              </div>
            </div>

            {/* Product Info Skeleton */}
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="h-8 w-3/4 animate-pulse rounded-card bg-navy/14" />
                <div className="h-4 w-1/2 animate-pulse rounded-card bg-navy/14" />
              </div>

              <div className="h-24 animate-pulse rounded-card bg-navy/14" />

              <div className="space-y-4">
                <div className="h-6 w-1/3 animate-pulse rounded-card bg-navy/14" />
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 animate-pulse rounded-card bg-navy/14" />
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-12 flex-1 animate-pulse rounded-pill bg-navy/14" />
                <div className="h-12 w-12 animate-pulse rounded-pill bg-navy/14" />
              </div>
            </div>
          </div>

          {/* Description Skeleton */}
          <div className="mb-12 space-y-4">
            <div className="h-6 w-1/4 animate-pulse rounded-card bg-navy/14" />
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`h-4 animate-pulse rounded-card bg-navy/14 ${i === 5 ? 'w-3/4' : 'w-full'}`}
                />
              ))}
            </div>
          </div>

          {/* Related Products Skeleton */}
          <div className="space-y-6">
            <div className="h-6 w-1/3 animate-pulse rounded-card bg-navy/14" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
