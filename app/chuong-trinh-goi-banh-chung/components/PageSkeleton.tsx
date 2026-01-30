"use client";

export function PageSkeleton() {
    return (
        <div className="page-skeleton">
            {/* Hero Skeleton */}
            <div className="skeleton-hero">
                <div className="skeleton-shimmer" />
            </div>

            {/* Content Sections Skeleton */}
            <div className="skeleton-section">
                <div className="skeleton-title" />
                <div className="skeleton-text" />
                <div className="skeleton-text short" />
            </div>

            <div className="skeleton-section">
                <div className="skeleton-title" />
                <div className="skeleton-grid">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="skeleton-card" />
                    ))}
                </div>
            </div>

            <div className="skeleton-section">
                <div className="skeleton-title" />
                <div className="skeleton-timeline">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="skeleton-timeline-item" />
                    ))}
                </div>
            </div>
        </div>
    );
}
