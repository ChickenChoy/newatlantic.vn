'use client';

export function ProductCardSkeleton() {
  return (
    <div className="h-full w-full animate-pulse">
      {/* Mirrors ProductCard: 10px radius, surface image well, light card body */}
      <div className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-card border border-navy/14 bg-background">
        {/* Image well */}
        <div className="aspect-square w-full shrink-0 bg-surface" />

        {/* Body */}
        <div className="flex flex-grow flex-col gap-3 p-6 md:p-8">
          <div className="h-3 w-1/3 rounded-pill bg-navy/14"></div>
          <div className="h-6 w-3/4 rounded-card bg-navy/14"></div>
          <div className="h-4 w-1/2 rounded-card bg-navy/14"></div>
          <div className="mt-auto h-4 w-2/5 rounded-card bg-navy/14"></div>
        </div>
      </div>
    </div>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-card border border-navy/14 bg-background">
      <div className="aspect-[4/3] bg-surface"></div>
      <div className="space-y-4 p-6 md:p-8">
        <div className="h-3 w-1/4 rounded-pill bg-navy/14"></div>
        <div className="h-5 w-full rounded-card bg-navy/14"></div>
        <div className="h-4 w-5/6 rounded-card bg-navy/14"></div>
        <div className="h-3 w-1/3 rounded-card bg-navy/14"></div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-8 w-1/3 animate-pulse rounded-card bg-navy/14"></div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <ProductCardSkeleton key={i} />
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
          className={`h-4 animate-pulse rounded-card bg-navy/14 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
        ></div>
      ))}
    </div>
  );
}

export function SkeletonLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-card bg-navy/14 ${className}`}></div>
  );
}
