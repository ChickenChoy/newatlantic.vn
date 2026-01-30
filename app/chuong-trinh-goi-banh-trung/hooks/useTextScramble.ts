"use client";

import { useState, useEffect, useCallback } from "react";

const chars = "!<>-_\\/[]{}—=+*^?#________";

export function useTextScramble(text: string, trigger: boolean, speed: number = 30) {
    const [displayText, setDisplayText] = useState(text);

    const scramble = useCallback(() => {
        let iteration = 0;
        const interval = setInterval(() => {
            setDisplayText(
                text
                    .split("")
                    .map((char, index) => {
                        if (char === " ") return " ";
                        if (index < iteration) return text[index];
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("")
            );

            if (iteration >= text.length) {
                clearInterval(interval);
            }
            iteration += 1 / 2;
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    useEffect(() => {
        if (trigger) {
            return scramble();
        }
    }, [trigger, scramble]);

    return displayText;
}

export function useScrollReveal(threshold: number = 0.15) {
    const [isVisible, setIsVisible] = useState(false);
    const [elementRef, setElementRef] = useState<HTMLElement | null>(null);

    useEffect(() => {
        if (!elementRef) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold, rootMargin: "0px 0px -50px 0px" }
        );

        observer.observe(elementRef);

        return () => observer.disconnect();
    }, [elementRef, threshold]);

    return { ref: setElementRef, isVisible };
}
