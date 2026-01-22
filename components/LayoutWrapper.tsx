"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import HeaderBottom from "@/components/HeaderBottom";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import FloatingContactButtons from "@/components/FloatingContactButtons";
import ScrollToTop from "@/components/ScrollToTop";
import GlobalBackground from "@/components/GlobalBackground";

// Routes that should NOT show the main header/footer
const STANDALONE_ROUTES = ["/masttech"];

export default function LayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Check if current path is a standalone route (no header/footer)
    const isStandalonePage = STANDALONE_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    // For standalone pages, just render children without header/footer
    if (isStandalonePage) {
        return <>{children}</>;
    }

    // For normal pages, render with full layout
    return (
        <>
            <GlobalBackground />
            <ScrollProgressBar />
            <Header />
            <HeaderBottom />
            <PageTransition>
                <main className="min-h-screen">{children}</main>
            </PageTransition>
            <Footer />
            <FloatingContactButtons />
            <ScrollToTop />
        </>
    );
}
