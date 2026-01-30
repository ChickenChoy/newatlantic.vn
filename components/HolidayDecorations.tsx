"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { HolidayEffect } from "@/types";
import "@/styles/holiday-decorations.css";

const EXCLUDED_PATHS = ["/chuong-trinh-goi-banh-chung"];
const ADMIN_PATHS = ["/admin"];

// Decoration types for different holidays
const HOLIDAY_PARTICLES: Record<string, { emoji: string[]; count: number }> = {
    'tet-nguyen-dan': {
        emoji: ['🌸', '🏮', '🧧', '✨', '🎋', '🌺'],
        count: 20
    },
    'giang-sinh': {
        emoji: ['❄️', '⛄', '🎄', '✨', '🌟', '❅'],
        count: 25
    },
    'valentine': {
        emoji: ['💕', '❤️', '💝', '💗', '💖', '🌹'],
        count: 20
    },
    'tet-trung-thu': {
        emoji: ['🏮', '🥮', '🌙', '⭐', '✨', '🎑'],
        count: 18
    },
    'quoc-khanh': {
        emoji: ['⭐', '✨', '🎆', '🎇', '🌟', '💫'],
        count: 15
    },
    'giai-phong-mien-nam': {
        emoji: ['⭐', '✨', '🎆', '🌟', '💫', '🎇'],
        count: 15
    },
    'tet-duong-lich': {
        emoji: ['🎆', '✨', '🎊', '🎉', '⭐', '💫'],
        count: 18
    },
};

interface Particle {
    id: number;
    emoji: string;
    style: React.CSSProperties;
}

function generateParticles(holidaySlug: string): Particle[] {
    const config = HOLIDAY_PARTICLES[holidaySlug] || { emoji: ['✨', '⭐'], count: 15 };
    const particles: Particle[] = [];

    for (let i = 0; i < config.count; i++) {
        const emoji = config.emoji[Math.floor(Math.random() * config.emoji.length)];
        const left = Math.random() * 100;
        const delay = Math.random() * 8;
        const duration = 8 + Math.random() * 6;
        const size = 0.8 + Math.random() * 0.6;

        particles.push({
            id: i,
            emoji,
            style: {
                left: `${left}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                fontSize: `${size}rem`,
            },
        });
    }

    return particles;
}

/**
 * HolidayDecorations - Dynamic falling effects for all holidays
 */
export default function HolidayDecorations() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [activeHoliday, setActiveHoliday] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMounted(true);

        const checkHolidayEffects = async () => {
            try {
                const response = await fetch('/api/holiday-effects');
                if (response.ok) {
                    const effects: HolidayEffect[] = await response.json();
                    // Find first enabled holiday with falling effect types (flowers, snow, or fireworks)
                    const fallingEffectTypes = ['flowers', 'snow', 'fireworks'];
                    const activeEffect = effects.find(
                        (e) => e.enabled === true &&
                            e.effectTypes?.some(type => fallingEffectTypes.includes(type))
                    );
                    setActiveHoliday(activeEffect?.slug || null);
                }
            } catch (error) {
                console.error('Error fetching holiday effects:', error);
            } finally {
                setLoading(false);
            }
        };

        checkHolidayEffects();
    }, []);

    const particles = useMemo(() => {
        if (!activeHoliday) return [];
        return generateParticles(activeHoliday);
    }, [activeHoliday]);

    const isExcludedPath = useMemo(() => {
        return (
            EXCLUDED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`)) ||
            ADMIN_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
        );
    }, [pathname]);

    if (!mounted || loading || !activeHoliday || isExcludedPath) {
        return null;
    }

    const content = (
        <div className={`holiday-particles holiday-${activeHoliday}`} aria-hidden="true">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="holiday-particle"
                    style={particle.style}
                >
                    {particle.emoji}
                </div>
            ))}
        </div>
    );

    return createPortal(content, document.body);
}
