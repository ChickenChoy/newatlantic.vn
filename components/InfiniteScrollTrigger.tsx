'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import LoadingIndicator from './LoadingIndicator';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_BRAND, DURATION_REVEAL } from './motion/ease';

interface InfiniteScrollTriggerProps {
    onLoadMore: () => void;
    isLoading: boolean;
    hasMore: boolean;
    loadingText?: string;
    threshold?: number;
    skeletonCount?: number;
}

export default function InfiniteScrollTrigger({
    onLoadMore,
    isLoading,
    hasMore,
    loadingText,
    threshold = 0.5,
    skeletonCount = 3
}: InfiniteScrollTriggerProps) {
    const reduceMotion = useReducedMotion();
    const { ref, inView } = useInView({
        threshold,
        triggerOnce: false,
    });

    useEffect(() => {
        if (inView && hasMore && !isLoading) {
            onLoadMore();
        }
    }, [inView, hasMore, isLoading, onLoadMore]);

    if (!hasMore) {
        return (
            <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION_REVEAL, ease: EASE_BRAND }}
                className="py-16 text-center"
            >
                <div className="inline-flex flex-col items-center gap-5 rounded-card border border-navy/14 bg-surface px-10 py-8">
                    {/* Completed marker */}
                    <span className="flex h-14 w-14 items-center justify-center rounded-pill bg-accent/10 text-accent">
                        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <motion.path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M5 13l4 4L19 7"
                                initial={reduceMotion ? false : { pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.5, delay: 0.15, ease: EASE_BRAND }}
                            />
                        </svg>
                    </span>

                    {/* Text */}
                    <div>
                        <p className="font-display text-d6 uppercase leading-display tracking-display text-navy">
                            Đã hiển thị tất cả sản phẩm
                        </p>
                        <p className="mt-3 text-sm leading-[1.6] text-muted">
                            Hãy quay lại sau để xem thiết bị mới cập nhật
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div ref={ref} className="w-full">
            {isLoading ? (
                <LoadingIndicator text={loadingText} />
            ) : (
                <div className="h-20" /> // Invisible trigger area
            )}
        </div>
    );
}

// End of list component
export function EndOfList({ message = 'Bạn đã xem hết tất cả sản phẩm' }: { message?: string }) {
    const reduceMotion = useReducedMotion();

    return (
        <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION_REVEAL, ease: EASE_BRAND }}
            className="py-20 text-center"
        >
            <div className="inline-block">
                <span className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-pill border border-navy/14 bg-surface text-accent">
                    <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </span>
                <p className="font-display text-d5 uppercase leading-display tracking-display text-navy">
                    {message}
                </p>
                <p className="mt-4 text-sm leading-[1.6] text-muted">
                    Hãy quay lại sau để xem thiết bị mới cập nhật
                </p>
            </div>
        </motion.div>
    );
}
