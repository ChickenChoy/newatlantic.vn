"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import "@/styles/tet-decorations.css";

// Paths that already have Tết decorations (exclude from global effect)
const EXCLUDED_PATHS = ["/chuong-trinh-goi-banh-trung"];

// Admin paths - no decorations needed
const ADMIN_PATHS = ["/admin"];

/**
 * Check if current date is within Tết season (fallback for SSR)
 */
export function isTetSeason(): boolean {
    const now = new Date();
    const year = now.getFullYear();

    const tetPeriods: Record<number, [number, number, number, number]> = {
        2025: [0, 20, 2, 15],
        2026: [0, 20, 2, 10],
        2027: [1, 1, 2, 28],
        2028: [0, 20, 2, 15],
    };

    const period = tetPeriods[year];
    if (!period) {
        const start = new Date(year, 0, 20);
        const end = new Date(year, 1, 28);
        return now >= start && now <= end;
    }

    const [startMonth, startDay, endMonth, endDay] = period;
    const start = new Date(year, startMonth, startDay);
    const end = new Date(year, endMonth, endDay, 23, 59, 59);

    return now >= start && now <= end;
}

interface TetBannerProps {
    variant?: "hero" | "inline" | "minimal";
    className?: string;
}

/**
 * Tết Banner - Premium Lunar New Year Banner
 * Variants:
 * - hero: Large showcase banner with full decorations
 * - inline: Medium banner for sections
 * - minimal: Small compact banner
 */
export default function TetBanner({
    variant = "hero",
    className = "",
}: TetBannerProps) {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [isTetEnabled, setIsTetEnabled] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMounted(true);

        // Fetch holiday effects from API
        const checkHolidayEffects = async () => {
            try {
                const response = await fetch('/api/holiday-effects');
                if (response.ok) {
                    const effects = await response.json();
                    // Find Tet effect and check if enabled
                    const tetEffect = effects.find((e: { slug: string }) => e.slug === 'tet-nguyen-dan');
                    // Only enable if explicitly enabled in admin
                    setIsTetEnabled(tetEffect?.enabled === true);
                } else {
                    // API error - fallback to date-based check
                    setIsTetEnabled(isTetSeason());
                }
            } catch (error) {
                console.error('Error fetching holiday effects:', error);
                // Network error - fallback to date-based check
                setIsTetEnabled(isTetSeason());
            } finally {
                setLoading(false);
            }
        };

        checkHolidayEffects();
    }, []);

    // Check if current path should be excluded
    const isExcludedPath =
        EXCLUDED_PATHS.some(
            (path) => pathname === path || pathname.startsWith(`${path}/`)
        ) ||
        ADMIN_PATHS.some(
            (path) => pathname === path || pathname.startsWith(`${path}/`)
        );

    // Don't render if not mounted, loading, not Tết enabled, or excluded path
    if (!mounted || loading || !isTetEnabled || isExcludedPath) {
        return null;
    }

    // Hero variant - Large premium banner
    if (variant === "hero") {
        return (
            <div className={`tet-banner-hero ${className}`}>
                {/* Background decorations */}
                <div className="tet-banner-bg">
                    <div className="tet-banner-pattern"></div>
                    <div className="tet-banner-glow tet-banner-glow-1"></div>
                    <div className="tet-banner-glow tet-banner-glow-2"></div>
                </div>

                {/* Corner decorations */}
                <div className="tet-corner tet-corner-tl">
                    <svg viewBox="0 0 100 100" className="tet-corner-svg">
                        <path d="M0,0 L100,0 L100,20 Q50,20 50,50 Q50,80 0,100 L0,0 Z" fill="currentColor" />
                    </svg>
                </div>
                <div className="tet-corner tet-corner-tr">
                    <svg viewBox="0 0 100 100" className="tet-corner-svg">
                        <path d="M100,0 L0,0 L0,20 Q50,20 50,50 Q50,80 100,100 L100,0 Z" fill="currentColor" />
                    </svg>
                </div>

                {/* Main content */}
                <div className="tet-banner-content">
                    {/* Left lantern */}
                    <div className="tet-lantern tet-lantern-left">
                        <div className="tet-lantern-top"></div>
                        <div className="tet-lantern-body">
                            <span>福</span>
                        </div>
                        <div className="tet-lantern-tassel"></div>
                    </div>

                    {/* Center text */}
                    <div className="tet-banner-text">
                        <div className="tet-banner-year">
                            <span className="tet-year-icon">🏇</span>
                            <span className="tet-year-text">Bính Ngọ 2026</span>
                            <span className="tet-year-icon">🏇</span>
                        </div>
                        <h2 className="tet-banner-title">
                            Chúc Mừng Năm Mới
                        </h2>
                        <p className="tet-banner-subtitle">
                            <span className="tet-company">Tân Đại Tây Dương</span>
                            <span className="tet-divider">—</span>
                            <span className="tet-wishes">Kính chúc Quý Khách</span>
                        </p>
                        <div className="tet-banner-blessing">
                            <span className="tet-blessing-item">An Khang</span>
                            <span className="tet-blessing-dot">•</span>
                            <span className="tet-blessing-item">Thịnh Vượng</span>
                            <span className="tet-blessing-dot">•</span>
                            <span className="tet-blessing-item">Như Ý</span>
                        </div>
                    </div>

                    {/* Right lantern */}
                    <div className="tet-lantern tet-lantern-right">
                        <div className="tet-lantern-top"></div>
                        <div className="tet-lantern-body">
                            <span>祿</span>
                        </div>
                        <div className="tet-lantern-tassel"></div>
                    </div>
                </div>

                {/* Bottom decoration */}
                <div className="tet-banner-bottom">
                    <div className="tet-wave"></div>
                </div>
            </div>
        );
    }

    // Inline variant - Medium banner
    if (variant === "inline") {
        return (
            <div className={`tet-banner-inline ${className}`}>
                <div className="tet-inline-bg"></div>
                <div className="tet-inline-content">
                    <span className="tet-inline-icon">🧧</span>
                    <div className="tet-inline-text">
                        <span className="tet-inline-greeting">Chúc Mừng Năm Mới 2026</span>
                        <span className="tet-inline-divider">|</span>
                        <span className="tet-inline-company">Tân Đại Tây Dương</span>
                        <span className="tet-inline-wish">kính chúc An Khang Thịnh Vượng!</span>
                    </div>
                    <span className="tet-inline-icon">🧧</span>
                </div>
            </div>
        );
    }

    // Minimal variant - Simple elegant design
    return (
        <div className={`tet-banner-minimal ${className}`}>
            <div className="tet-mini-wrapper">
                {/* Left decoration */}
                <div className="tet-mini-decor">
                    <span>🧧</span>
                </div>

                {/* Center content */}
                <div className="tet-mini-center">
                    <span className="tet-mini-title">
                        🏇 Xuân Bính Ngọ 2026
                    </span>
                    <span className="tet-mini-divider">—</span>
                    <span className="tet-mini-message">
                        <span className="tet-mini-company">Tân Đại Tây Dương</span> kính chúc Quý Khách An Khang Thịnh Vượng!
                    </span>
                </div>

                {/* Right decoration */}
                <div className="tet-mini-decor">
                    <span>🧧</span>
                </div>
            </div>
        </div>
    );
}
