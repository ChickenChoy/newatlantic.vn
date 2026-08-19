'use client';

import ArrowButton from './sections/ArrowButton';

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
        <div className={`rounded-card border border-navy/14 bg-surface px-6 py-20 text-center ${className}`}>
            {/* Icon */}
            {icon ? (
                <div className="mb-8 flex justify-center" aria-hidden="true">
                    {icon}
                </div>
            ) : (
                <svg
                    className="mx-auto mb-8 h-20 w-20 text-navy/14"
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
            <h3 className="font-display text-d5 uppercase leading-display tracking-display text-navy">
                {title}
            </h3>

            {/* Description */}
            <p className="mx-auto mt-4 max-w-md text-base leading-[1.6] text-ink">
                {description}
            </p>

            {/* Action Button */}
            {actionLabel && actionHref && (
                <div className="mt-8 flex justify-center">
                    <ArrowButton href={actionHref} variant="accent">
                        {actionLabel}
                    </ArrowButton>
                </div>
            )}
        </div>
    );
}
