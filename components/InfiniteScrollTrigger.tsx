'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import LoadingIndicator from './LoadingIndicator';
import { motion } from 'framer-motion';

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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-16 text-center"
            >
                <div className="inline-flex flex-col items-center gap-4 px-8 py-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl">
                    {/* Success Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center border-2 border-green-400/30"
                    >
                        <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <motion.path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M5 13l4 4L19 7"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            />
                        </svg>
                    </motion.div>

                    {/* Text */}
                    <div className="space-y-1">
                        <p className="text-white font-semibold text-lg">
                            Đã hiển thị tất cả sản phẩm
                        </p>
                        <p className="text-white/60 text-sm">
                            Hãy quay lại sau để xem thêm sản phẩm mới
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
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-20 text-center"
        >
            <div className="inline-block">
                <motion.div
                    className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full flex items-center justify-center border-2 border-blue-400/30"
                    animate={{
                        boxShadow: [
                            '0 0 20px rgba(59, 130, 246, 0.2)',
                            '0 0 40px rgba(99, 102, 241, 0.4)',
                            '0 0 20px rgba(59, 130, 246, 0.2)'
                        ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </motion.div>
                <motion.p
                    className="text-white font-semibold text-xl mb-2"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {message}
                </motion.p>
                <motion.p
                    className="text-white/60 text-sm"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Hãy quay lại sau để xem thêm sản phẩm mới
                </motion.p>
            </div>
        </motion.div>
    );
}
