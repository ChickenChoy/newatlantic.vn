'use client';

import { useEffect, useState, useRef } from 'react';

interface TypingTextProps {
    texts: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
    pauseTime?: number;
    className?: string;
    cursorClassName?: string;
    loop?: boolean;
}

export default function TypingText({
    texts,
    typingSpeed = 80,
    deletingSpeed = 50,
    pauseTime = 2000,
    className = '',
    cursorClassName = '',
    loop = true,
}: TypingTextProps) {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    // Start animation when element is in view
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasStarted) {
                        setHasStarted(true);
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [hasStarted]);

    useEffect(() => {
        if (!hasStarted) return;

        const currentFullText = texts[currentTextIndex];

        if (isPaused) {
            const pauseTimeout = setTimeout(() => {
                setIsPaused(false);
                if (loop || currentTextIndex < texts.length - 1) {
                    setIsDeleting(true);
                }
            }, pauseTime);
            return () => clearTimeout(pauseTimeout);
        }

        if (isDeleting) {
            if (currentText === '') {
                setIsDeleting(false);
                setCurrentTextIndex((prev) => (prev + 1) % texts.length);
            } else {
                const timeout = setTimeout(() => {
                    setCurrentText((prev) => prev.slice(0, -1));
                }, deletingSpeed);
                return () => clearTimeout(timeout);
            }
        } else {
            if (currentText === currentFullText) {
                setIsPaused(true);
            } else {
                const timeout = setTimeout(() => {
                    setCurrentText((prev) => currentFullText.slice(0, prev.length + 1));
                }, typingSpeed);
                return () => clearTimeout(timeout);
            }
        }
    }, [currentText, isDeleting, isPaused, currentTextIndex, texts, typingSpeed, deletingSpeed, pauseTime, loop, hasStarted]);

    return (
        <span ref={ref} className={className}>
            {currentText}
            <span
                className={`inline-block w-[3px] h-[1em] bg-current ml-1 animate-pulse ${cursorClassName}`}
                style={{ verticalAlign: 'text-bottom' }}
            />
        </span>
    );
}
