'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { PageHero, ArrowButton } from '@/components/sections';

interface PageGuardProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * PageGuard component that checks if the current page is visible to users.
 * If the page is hidden by admin, it shows a "Page Not Available" message.
 */
export default function PageGuard({ children, fallback }: PageGuardProps) {
    const pathname = usePathname() ?? '';
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
            <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
                <div className="text-center">
                    <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                    <p className="font-display text-[11px] uppercase leading-none tracking-display text-navy/60">
                        Đang tải
                    </p>
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
            <PageHero
                eyebrow="Tạm thời không khả dụng"
                title="Trang đang được bảo trì"
                intro={
                    <>
                        {pageName && <span className="text-white">{pageName}</span>}
                        {pageName && ' — '}
                        Trang này hiện đang được bảo trì hoặc tạm thời ẩn. Vui lòng quay lại sau hoặc
                        liên hệ với chúng tôi nếu bạn cần hỗ trợ.
                    </>
                }
                align="center"
                actions={
                    <>
                        <ArrowButton href="/" variant="white">
                            Về trang chủ
                        </ArrowButton>
                        <ArrowButton href="/lien-he" variant="outline-light">
                            Liên hệ
                        </ArrowButton>
                    </>
                }
            />
        );
    }

    // Page is visible
    return <>{children}</>;
}
