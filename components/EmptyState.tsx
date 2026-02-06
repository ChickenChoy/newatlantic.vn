'use client';

import Link from 'next/link';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    className?: string;
}

export default function EmptyState({
    icon,
    title,
    description,
    actionLabel,
    actionHref,
    className = ''
}: EmptyStateProps) {
    return (
        <div className={`text-center py-16 md:py-20 ${className}`}>
            {/* Icon */}
            {icon ? (
                <div className="mb-6" aria-hidden="true">
                    {icon}
                </div>
            ) : (
                <svg
                    className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                </svg>
            )}

            {/* Title */}
            <h3 className="text-xl md:text-2xl font-bold text-gray-700 mb-3">
                {title}
            </h3>

            {/* Description */}
            <p className="text-gray-500 text-sm md:text-base mb-6 max-w-md mx-auto leading-relaxed">
                {description}
            </p>

            {/* Action Button */}
            {actionLabel && actionHref && (
                <Link
                    href={actionHref}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white px-6 py-3 rounded-lg font-semibold hover:from-[#4a6199] hover:to-[#3d4f7d] transition-all duration-300 shadow-md hover:shadow-xl"
                >
                    {actionLabel}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            )}
        </div>
    );
}
