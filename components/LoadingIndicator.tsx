'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { EASE_BRAND } from './motion/ease';

interface LoadingIndicatorProps {
    text?: string;
}

export default function LoadingIndicator({ text = 'Đang tải thêm sản phẩm...' }: LoadingIndicatorProps) {
    const reduceMotion = useReducedMotion();

    return (
        <div className="flex flex-col items-center justify-center py-12">
            {/* Loading Text */}
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.14em] text-muted">
                {text}
            </p>

            {/* Animated Dots */}
            <div className="flex gap-2" role="status" aria-live="polite">
                {[0, 1, 2].map((i) => (
                    <motion.span
                        key={i}
                        className="h-2.5 w-2.5 rounded-pill bg-accent"
                        animate={reduceMotion ? undefined : { y: [0, -12, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{
                            duration: 0.9,
                            repeat: Infinity,
                            delay: i * 0.15,
                            ease: EASE_BRAND
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

// Skeleton variant for product cards
export function ProductListSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 lg:gap-8 xl:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="animate-pulse overflow-hidden rounded-card border border-navy/14 bg-background"
                >
                    {/* Image well */}
                    <div className="aspect-square w-full bg-surface" />

                    {/* Content skeleton */}
                    <div className="space-y-3 p-6 md:p-8">
                        <div className="h-3 w-1/3 rounded-pill bg-navy/14" />
                        <div className="h-6 w-3/4 rounded-card bg-navy/14" />
                        <div className="h-4 w-1/2 rounded-card bg-navy/14" />
                        <div className="mt-2 h-4 w-2/5 rounded-card bg-navy/14" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// Simple spinner for inline use
export function Spinner({ className = '' }: { className?: string }) {
    return (
        <div className={`inline-block ${className}`}>
            <motion.span
                className="block h-6 w-6 rounded-pill border-2 border-navy/14 border-t-accent"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
        </div>
    );
}
