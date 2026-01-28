'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface PageGuardProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * PageGuard component that checks if the current page is visible to users.
 * If the page is hidden by admin, it shows a "Page Not Available" message.
 */
export default function PageGuard({ children, fallback }: PageGuardProps) {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [pageName, setPageName] = useState<string>('');

    useEffect(() => {
        const checkPageVisibility = async () => {
            // Skip check for admin pages
            if (pathname.startsWith('/admin')) {
                setIsVisible(true);
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/page-visibility?path=${encodeURIComponent(pathname)}`);
                if (response.ok) {
                    const data = await response.json();
                    setIsVisible(data.visible);
                    setPageName(data.page?.name || '');
                } else {
                    // If API fails, default to visible
                    setIsVisible(true);
                }
            } catch (error) {
                console.error('Error checking page visibility:', error);
                // Default to visible if check fails
                setIsVisible(true);
            } finally {
                setIsLoading(false);
            }
        };

        checkPageVisibility();
    }, [pathname]);

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#050c3a] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    <p className="text-gray-400">Đang tải...</p>
                </div>
            </div>
        );
    }

    // Page is hidden
    if (isVisible === false) {
        if (fallback) {
            return <>{fallback}</>;
        }

        return (
            <div className="min-h-screen bg-[#050c3a] flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    {/* Icon */}
                    <div className="mb-6">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                        </div>
                    </div>

                    {/* Message */}
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                        Trang Tạm Thời Không Khả Dụng
                    </h1>

                    <p className="text-gray-400 mb-2">
                        {pageName && <span className="text-blue-400 font-semibold">{pageName}</span>}
                        {pageName && ' - '}
                        Trang này hiện đang được bảo trì hoặc tạm thời ẩn.
                    </p>

                    <p className="text-gray-500 text-sm mb-8">
                        Vui lòng quay lại sau hoặc liên hệ với chúng tôi nếu bạn cần hỗ trợ.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] hover:from-[#4a6199] hover:to-[#3d4f7a] text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Về trang chủ
                        </Link>

                        <Link
                            href="/lien-he"
                            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl border border-white/20 transition-all duration-300"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Liên hệ
                        </Link>
                    </div>

                    {/* Decorative elements */}
                    <div className="mt-12 flex justify-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500/50 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-orange-500/50 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-red-500/50 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    // Page is visible
    return <>{children}</>;
}
