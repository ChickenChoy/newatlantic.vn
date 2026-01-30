"use client";

import { useState, useEffect, useRef } from "react";

export function SoundToggle() {
    const [enabled, setEnabled] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Create audio element for Tet music
        audioRef.current = new Audio("/sounds/tet-ambient.mp3");
        if (audioRef.current) {
            audioRef.current.loop = true;
            audioRef.current.volume = 0.2;
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const toggleSound = () => {
        if (!audioRef.current) return;

        if (enabled) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(() => {
                // Handle autoplay restrictions
                console.log("Audio playback requires user interaction");
            });
        }
        setEnabled(!enabled);
    };

    return (
        <button
            className={`sound-toggle ${enabled ? "enabled" : ""}`}
            onClick={toggleSound}
            aria-label={enabled ? "Tắt nhạc nền" : "Bật nhạc nền"}
            title={enabled ? "Tắt nhạc nền" : "Bật nhạc nền"}
        >
            {enabled ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
            ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <line x1="23" y1="9" x2="17" y2="15"></line>
                    <line x1="17" y1="9" x2="23" y2="15"></line>
                </svg>
            )}
        </button>
    );
}
