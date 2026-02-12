"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const STORAGE_KEY = "popup-announcement-dismissed";

interface PopupSettings {
    enabled: boolean;
    image: string;
    title: string;
    dismissHours: number;
    linkedHolidaySlug: string;
    delayMs: number;
    maxWidth: number;
}

const DEFAULT_SETTINGS: PopupSettings = {
    enabled: true,
    image: "/images/TB NGHI TET trang.png",
    title: "Thông báo lịch nghỉ Tết Nguyên Đán 2026",
    dismissHours: 24,
    linkedHolidaySlug: "tet-nguyen-dan",
    delayMs: 1800,
    maxWidth: 360,
};

export default function TetAnnouncementPopup() {
    const [phase, setPhase] = useState<"hidden" | "entering" | "visible" | "leaving">("hidden");
    const [settings, setSettings] = useState<PopupSettings>(DEFAULT_SETTINGS);
    const backdropRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const init = async () => {
            try {
                // Fetch popup settings
                const settingsRes = await fetch("/api/popup-settings");
                let popupSettings = DEFAULT_SETTINGS;
                if (settingsRes.ok) {
                    const data = await settingsRes.json();
                    popupSettings = { ...DEFAULT_SETTINGS, ...data };
                }

                // Check if popup is enabled
                if (!popupSettings.enabled) return;

                // Check dismiss state
                const dismissedAt = localStorage.getItem(STORAGE_KEY);
                if (dismissedAt) {
                    const elapsed = Date.now() - parseInt(dismissedAt, 10);
                    if (elapsed < popupSettings.dismissHours * 60 * 60 * 1000) return;
                }

                // Check linked holiday if specified
                if (popupSettings.linkedHolidaySlug) {
                    const res = await fetch("/api/holiday-effects");
                    if (res.ok) {
                        const effects = await res.json();
                        const linkedEffect = effects.find(
                            (e: { slug: string }) => e.slug === popupSettings.linkedHolidaySlug
                        );
                        if (!linkedEffect?.enabled) return;
                    }
                }

                setSettings(popupSettings);

                // Show popup with delay
                setTimeout(() => {
                    setPhase("entering");
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => setPhase("visible"));
                    });
                }, popupSettings.delayMs);
            } catch {
                // Silently fail
            }
        };

        init();
    }, []);

    const handleClose = () => {
        setPhase("leaving");
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
        setTimeout(() => setPhase("hidden"), 350);
    };

    if (phase === "hidden") return null;

    const isActive = phase === "visible";
    const isLeaving = phase === "leaving";

    return (
        <div
            ref={backdropRef}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
            style={{
                backgroundColor: isActive ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0)",
                backdropFilter: isActive ? "blur(6px)" : "blur(0px)",
                transition: "background-color 0.4s ease, backdrop-filter 0.4s ease",
                opacity: isLeaving ? 0 : 1,
            }}
            onClick={handleClose}
        >
            <div
                className="relative w-full"
                style={{
                    maxWidth: `${settings.maxWidth}px`,
                    transform: isActive ? "scale(1) translateY(0)" : isLeaving ? "scale(0.9) translateY(20px)" : "scale(0.85) translateY(30px)",
                    opacity: isActive ? 1 : 0,
                    transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button — glass style */}
                <button
                    onClick={handleClose}
                    className="absolute -top-2.5 -right-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-white/90 text-gray-500 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white hover:text-red-500 hover:shadow-lg"
                    aria-label="Đóng thông báo"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Card with subtle glow */}
                <div
                    className="overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/20"
                    style={{
                        boxShadow: "0 25px 60px -15px rgba(0,0,0,0.35), 0 0 40px -10px rgba(220,50,50,0.15)",
                    }}
                >
                    <Image
                        src={settings.image}
                        alt={settings.title}
                        width={720}
                        height={900}
                        className="h-auto w-full"
                        priority
                    />
                </div>
            </div>
        </div>
    );
}
