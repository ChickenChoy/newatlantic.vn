"use client";

import { useRef, useEffect, useState } from "react";
import { useTextScramble } from "../hooks/useTextScramble";

interface ScrambleTextProps {
    text: string;
    className?: string;
    as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
    delay?: number;
}

export function ScrambleText({
    text,
    className = "",
    as: Component = "h2",
    delay = 0
}: ScrambleTextProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);
    const elementRef = useRef<HTMLElement>(null);
    const displayText = useTextScramble(text, hasTriggered);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasTriggered) {
                    setTimeout(() => {
                        setIsVisible(true);
                        setHasTriggered(true);
                    }, delay);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [delay, hasTriggered]);

    return (
        <Component
            ref={elementRef as React.RefObject<HTMLHeadingElement & HTMLParagraphElement & HTMLSpanElement>}
            className={`scramble-text ${className} ${isVisible ? "visible" : ""}`}
        >
            {displayText}
        </Component>
    );
}
