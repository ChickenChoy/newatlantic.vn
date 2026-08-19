"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import "@/styles/tet-decorations.css";

// Paths that already have TẾT decorations (exclude from global effect)
const EXCLUDED_PATHS = ["/chuong-trinh-goi-banh-chung"];

// Admin paths - no decorations needed
const ADMIN_PATHS = ["/admin"];

/**
 * Check if current date is within TẾT season
 */
function isTetSeason(): boolean {
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

/**
 * Generate flower elements with random positions and timing
 */
function generateFlowers(count: number) {
    const flowers = [];
    const flowerTypes = 6;

    for (let i = 0; i < count; i++) {
        const type = Math.floor(Math.random() * flowerTypes);
        const left = Math.random() * 100;
        const delay = Math.random() * 8;
        const duration = 8 + Math.random() * 6;

        flowers.push({
            id: i,
            type,
            style: {
                left: `${left}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
            },
        });
    }

    return flowers;
}

/**
 * TetDecorations - Falling flowers effect only
 * Renders via portal at body level for proper overlay
 */
export default function TetDecorations() {
    const pathname = usePathname() ?? '';
    const [mounted, setMounted] = useState(false);
    const [isFlowersEnabled, setIsFlowersEnabled] = useState(false);
    const [loading, setLoading] = useState(true);

    const flowers = useMemo(() => generateFlowers(20), []);

    useEffect(() => {
        setMounted(true);

        // Fetch holiday effects from API
        const checkHolidayEffects = async () => {
            try {
                const response = await fetch('/api/holiday-effects');
                if (response.ok) {
                    const effects = await response.json();
                    // Check if ANY enabled holiday has 'flowers' effect type
                    const hasFlowers = effects.some(
                        (e: { enabled: boolean; effectTypes?: string[] }) =>
                            e.enabled === true && e.effectTypes?.includes('flowers')
                    );
                    setIsFlowersEnabled(hasFlowers);
                } else {
                    // API error - fallback to date-based check
                    setIsFlowersEnabled(isTetSeason());
                }
            } catch (error) {
                console.error('Error fetching holiday effects:', error);
                // Network error - fallback to date-based check
                setIsFlowersEnabled(isTetSeason());
            } finally {
                setLoading(false);
            }
        };

        checkHolidayEffects();
    }, []);

    const isExcludedPath = useMemo(() => {
        return (
            EXCLUDED_PATHS.some(
                (path) =>
                    pathname === path || pathname.startsWith(`${path}/`)
            ) ||
            ADMIN_PATHS.some(
                (path) =>
                    pathname === path || pathname.startsWith(`${path}/`)
            )
        );
    }, [pathname]);

    if (!mounted || loading || !isFlowersEnabled || isExcludedPath) {
        return null;
    }

    const content = (
        <div className="tet-flowers" aria-hidden="true">
            {flowers.map((flower) => (
                <div
                    key={flower.id}
                    className={`tet-flower tet-flower-${flower.type}`}
                    style={flower.style}
                />
            ))}
        </div>
    );

    return createPortal(content, document.body);
}

