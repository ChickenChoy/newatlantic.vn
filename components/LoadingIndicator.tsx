'use client';

import { motion } from 'framer-motion';

interface LoadingIndicatorProps {
    text?: string;
}

export default function LoadingIndicator({ text = 'Đang tải thêm sản phẩm...' }: LoadingIndicatorProps) {
    return (
        <div className="py-12 flex flex-col items-center justify-center">
            {/* Loading Text */}
            <motion.p
                className="text-white/90 text-base font-medium mb-4"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                {text}
            </motion.p>

            {/* Animated Dots */}
            <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-3 h-3 bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] rounded-full shadow-lg shadow-[#5f7ab8]/40"
                        animate={{
                            y: [0, -16, 0],
                            scale: [1, 1.3, 1]
                        }}
                        transition={{
                            duration: 0.9,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: 'easeInOut'
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {Array.from({ length: count }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 shadow-lg"
                >
                    {/* Image skeleton with shimmer */}
                    <div className="aspect-square bg-gradient-to-br from-white/10 via-white/5 to-white/10 relative overflow-hidden">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                            animate={{ x: [-200, 400] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        />
                    </div>

                    {/* Content skeleton */}
                    <div className="p-6 space-y-3">
                        <div className="h-5 bg-white/10 rounded-lg w-3/4 overflow-hidden relative">
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                animate={{ x: [-100, 300] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                            />
                        </div>
                        <div className="h-4 bg-white/10 rounded-lg w-1/2 overflow-hidden relative">
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                animate={{ x: [-100, 300] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.1 }}
                            />
                        </div>
                        <div className="h-10 bg-white/10 rounded-lg w-full mt-4 overflow-hidden relative">
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                animate={{ x: [-100, 300] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.2 }}
                            />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

// Simple spinner for inline use
export function Spinner({ className = '' }: { className?: string }) {
    return (
        <div className={`inline-block ${className}`}>
            <motion.div
                className="w-6 h-6 border-3 border-white/20 border-t-[#5f7ab8] rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
        </div>
    );
}
