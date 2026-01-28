"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import HeaderBottom from "@/components/HeaderBottom";
import Footer, { FooterProps } from "@/components/Footer";

import ScrollProgressBar from "@/components/ScrollProgressBar";
import FloatingContactButtons from "@/components/FloatingContactButtons";
import ScrollToTop from "@/components/ScrollToTop";
import GlobalBackground from "@/components/GlobalBackground";
import TetDecorations from "@/components/TetDecorations";

// Routes that should NOT show the main header/footer
const STANDALONE_ROUTES = ["/masttech"];

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

    // For standalone pages, just render children without header/footer
    if (isStandalonePage) {
        return <>{children}</>;
    }

    // For normal pages, render with full layout
    return (
        <>
            <GlobalBackground />
            <ScrollProgressBar />
            <TetDecorations />
            <Header />
            <HeaderBottom />
            <main className="min-h-screen">{children}</main>
            <Footer {...footerData} />
            <FloatingContactButtons />
            <ScrollToTop />
        </>
    );
}


