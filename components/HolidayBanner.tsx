"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { HolidayEffect } from "@/types";
import "@/styles/holiday-banners.css";

// Paths to exclude banners
const EXCLUDED_PATHS = ["/chuong-trinh-goi-banh-trung"];
const ADMIN_PATHS = ["/admin"];

// Dynamic year calculations
function getCurrentYear(): number {
    return new Date().getFullYear();
}

// Vietnamese zodiac animals (Con giáp)
const ZODIAC_ANIMALS = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const ZODIAC_EMOJIS = ['🐀', '🐂', '🐅', '🐇', '🐉', '🐍', '🐴', '🐐', '🐵', '🐓', '🐕', '🐷'];

// Celestial stems (Thiên Can) - Correct order: Giáp=0, Ất=1, Bính=2...
const CELESTIAL_STEMS = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];

function getLunarYearInfo(year: number) {
    // Calculate zodiac (lunar new year usually starts late Jan/early Feb, but we use solar year for simplicity)
    const zodiacIndex = (year - 4) % 12;
    const stemIndex = (year - 4) % 10;

    return {
        animal: ZODIAC_ANIMALS[zodiacIndex],
        emoji: ZODIAC_EMOJIS[zodiacIndex],
        stem: CELESTIAL_STEMS[stemIndex],
        fullName: `${CELESTIAL_STEMS[stemIndex]} ${ZODIAC_ANIMALS[zodiacIndex]}`,
    };
}

// Generate dynamic holiday content
function getHolidayContent(slug: string) {
    const year = getCurrentYear();
    const lunarInfo = getLunarYearInfo(year);

    const contents: Record<string, {
        icon: string;
        title: string;
        subtitle: string;
        wishes: string[];
        decorLeft?: string;
        decorRight?: string;
        textColor?: string;
    }> = {
        'tet-nguyen-dan': {
            icon: lunarInfo.emoji,
            title: 'Chúc Mừng Năm Mới',
            subtitle: `Xuân ${lunarInfo.fullName} ${year}`,
            wishes: ['An Khang', 'Thịnh Vượng', 'Như Ý'],
            decorLeft: '🧧',
            decorRight: '🧧',
            textColor: '#ffd700',
        },
        'tet-duong-lich': {
            icon: '🎆',
            title: `Happy New Year ${year}`,
            subtitle: 'Chào Năm Mới',
            wishes: ['Hạnh Phúc', 'Thành Công', 'May Mắn'],
            decorLeft: '🎊',
            decorRight: '🎊',
            textColor: '#ffffff',
        },
        'gio-to-hung-vuong': {
            icon: '🏛️',
            title: 'Giỗ Tổ Hùng Vương',
            subtitle: '10/3 Âm Lịch',
            wishes: ['Uống nước nhớ nguồn', 'Tự hào dân tộc'],
            decorLeft: '🐉',
            decorRight: '🐉',
            textColor: '#fcd34d',
        },
        'giai-phong-mien-nam': {
            icon: '🎖️',
            title: 'Ngày Giải Phóng',
            subtitle: `30/4/1975 - 30/4/${year}`,
            wishes: ['Thống Nhất', 'Hòa Bình', 'Độc Lập'],
            decorLeft: '⭐',
            decorRight: '⭐',
            textColor: '#fbbf24',
        },
        'quoc-te-lao-dong': {
            icon: '💪',
            title: 'Quốc Tế Lao Động',
            subtitle: `1/5/${year}`,
            wishes: ['Lao động vinh quang', 'Thành công'],
            decorLeft: '🌟',
            decorRight: '🌟',
            textColor: '#fbbf24',
        },
        'quoc-khanh': {
            icon: '⭐',
            title: 'Quốc Khánh Việt Nam',
            subtitle: `2/9/1945 - 2/9/${year}`,
            wishes: ['Độc Lập', 'Tự Do', 'Hạnh Phúc'],
            decorLeft: '🎆',
            decorRight: '🎆',
            textColor: '#fbbf24',
        },
        'valentine': {
            icon: '💕',
            title: 'Happy Valentine',
            subtitle: `14/2/${year}`,
            wishes: ['Yêu thương', 'Hạnh phúc'],
            decorLeft: '💝',
            decorRight: '💝',
            textColor: '#ffffff',
        },
        'tet-trung-thu': {
            icon: '🥮',
            title: 'Tết Trung Thu',
            subtitle: `Rằm Tháng 8 - ${year}`,
            wishes: ['Đoàn viên', 'Hạnh phúc'],
            decorLeft: '🏮',
            decorRight: '🏮',
            textColor: '#ffffff',
        },
        'giang-sinh': {
            icon: '🎄',
            title: 'Merry Christmas',
            subtitle: `Giáng Sinh ${year}`,
            wishes: ['An Lành', 'Hạnh Phúc', 'Bình An'],
            decorLeft: '🎅',
            decorRight: '🎁',
            textColor: '#ffffff',
        },
    };

    return contents[slug] || {
        icon: '🎉',
        title: 'Chúc Mừng',
        subtitle: '',
        wishes: [],
        decorLeft: '✨',
        decorRight: '✨',
        textColor: '#ffd700',
    };
}


interface HolidayBannerProps {
    variant?: "hero" | "inline" | "minimal";
    className?: string;
}

export default function HolidayBanner({
    variant = "minimal",
    className = "",
}: HolidayBannerProps) {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [activeHoliday, setActiveHoliday] = useState<HolidayEffect | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMounted(true);

        const checkHolidayEffects = async () => {
            try {
                const response = await fetch('/api/holiday-effects');
                if (response.ok) {
                    const effects: HolidayEffect[] = await response.json();
                    // Find first enabled holiday with banner effect
                    const activeEffect = effects.find(
                        (e) => e.enabled === true && e.effectTypes?.includes('banner')
                    );
                    setActiveHoliday(activeEffect || null);
                }
            } catch (error) {
                console.error('Error fetching holiday effects:', error);
            } finally {
                setLoading(false);
            }
        };

        checkHolidayEffects();
    }, []);

    // Check excluded paths
    const isExcludedPath =
        EXCLUDED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`)) ||
        ADMIN_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

    if (!mounted || loading || !activeHoliday || isExcludedPath) {
        return null;
    }

    // Get dynamic content with current year
    const content = getHolidayContent(activeHoliday.slug);

    const primaryColor = activeHoliday.primaryColor || '#dc2626';
    const secondaryColor = activeHoliday.secondaryColor || '#ffd700';
    const textColor = content.textColor || secondaryColor;

    // Hero variant
    if (variant === "hero") {
        return (
            <div
                className={`holiday-banner-hero ${className}`}
                style={{
                    '--holiday-primary': primaryColor,
                    '--holiday-secondary': textColor,
                } as React.CSSProperties}
            >
                <div className="holiday-banner-bg">
                    <div className="holiday-banner-pattern"></div>
                    <div className="holiday-banner-glow holiday-glow-1"></div>
                    <div className="holiday-banner-glow holiday-glow-2"></div>
                </div>

                <div className="holiday-banner-content">
                    <div className="holiday-decor holiday-decor-left">
                        <span className="holiday-decor-icon">{content.decorLeft}</span>
                    </div>

                    <div className="holiday-banner-text">
                        <div className="holiday-banner-subtitle">
                            <span className="holiday-icon">{content.icon}</span>
                            <span>{content.subtitle}</span>
                            <span className="holiday-icon">{content.icon}</span>
                        </div>
                        <h2 className="holiday-banner-title">{content.title}</h2>
                        <p className="holiday-banner-company">
                            <span className="holiday-company-name">Tân Đại Tây Dương</span>
                            <span className="holiday-divider">—</span>
                            <span>Kính chúc Quý Khách</span>
                        </p>
                        {content.wishes.length > 0 && (
                            <div className="holiday-banner-wishes">
                                {content.wishes.map((wish, i) => (
                                    <span key={i}>
                                        <span className="holiday-wish-item">{wish}</span>
                                        {i < content.wishes.length - 1 && <span className="holiday-wish-dot">•</span>}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="holiday-decor holiday-decor-right">
                        <span className="holiday-decor-icon">{content.decorRight}</span>
                    </div>
                </div>
            </div>
        );
    }

    // Inline variant
    if (variant === "inline") {
        return (
            <div
                className={`holiday-banner-inline ${className}`}
                style={{
                    '--holiday-primary': primaryColor,
                    '--holiday-secondary': textColor,
                } as React.CSSProperties}
            >
                <div className="holiday-inline-bg"></div>
                <div className="holiday-inline-content">
                    <span className="holiday-inline-icon">{content.decorLeft}</span>
                    <div className="holiday-inline-text">
                        <span className="holiday-inline-greeting">{content.title}</span>
                        <span className="holiday-inline-divider">|</span>
                        <span className="holiday-inline-company">Tân Đại Tây Dương</span>
                        <span className="holiday-inline-wish">
                            kính chúc Quý Khách {content.wishes.join(' & ')}!
                        </span>
                    </div>
                    <span className="holiday-inline-icon">{content.decorRight}</span>
                </div>
            </div>
        );
    }

    // Minimal variant (default)
    return (
        <div
            className={`holiday-banner-minimal ${className}`}
            style={{
                '--holiday-primary': primaryColor,
                '--holiday-secondary': textColor,
            } as React.CSSProperties}
        >
            <div className="holiday-mini-wrapper">
                <div className="holiday-mini-decor">
                    <span>{content.decorLeft}</span>
                </div>

                <div className="holiday-mini-center">
                    <span className="holiday-mini-title">
                        {content.icon} {content.subtitle || content.title}
                    </span>
                    <span className="holiday-mini-divider">—</span>
                    <span className="holiday-mini-message">
                        <span className="holiday-mini-company">Tân Đại Tây Dương</span>
                        {' '}kính chúc Quý Khách {content.wishes.join(' & ')}!
                    </span>
                </div>

                <div className="holiday-mini-decor">
                    <span>{content.decorRight}</span>
                </div>
            </div>
        </div>
    );
}
