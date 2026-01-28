"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import HeaderBottom from "@/components/HeaderBottom";
import Footer, { FooterProps } from "@/components/Footer";

import ScrollProgressBar from "@/components/ScrollProgressBar";
import FloatingContactButtons from "@/components/FloatingContactButtons";
import ScrollToTop from "@/components/ScrollToTop";
import GlobalBackground from "@/components/GlobalBackground";
import HolidayDecorations from "@/components/HolidayDecorations";
import PageGuard from "@/components/PageGuard";

// Routes that should NOT show the main header/footer
const STANDALONE_ROUTES = ["/masttech"];

// Routes that should skip page visibility check
const SKIP_VISIBILITY_CHECK = ["/admin"];

interface LayoutWrapperProps {
    children: React.ReactNode;
    footerData: FooterProps;
}

export default function LayoutWrapper({
    children,
    footerData,
}: LayoutWrapperProps) {
    const pathname = usePathname();

    // Check if current path is a standalone route (no header/footer)
    const isStandalonePage = STANDALONE_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    // Check if should skip visibility check
    const shouldSkipVisibilityCheck = SKIP_VISIBILITY_CHECK.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    // For standalone pages, just render children without header/footer
    if (isStandalonePage) {
        return <>{children}</>;
    }

    // Wrap content with PageGuard for visibility check (unless skipped)
    const pageContent = shouldSkipVisibilityCheck ? (
        children
    ) : (
        <PageGuard>{children}</PageGuard>
    );

    // For normal pages, render with full layout
    return (
        <>
            <GlobalBackground />
            <ScrollProgressBar />
            <HolidayDecorations />
            <Header />
            <HeaderBottom />
            <main className="min-h-screen">{pageContent}</main>
            <Footer {...footerData} />
            <FloatingContactButtons />
            <ScrollToTop />
        </>
    );
}
