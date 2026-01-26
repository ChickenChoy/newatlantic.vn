'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
    end: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    className?: string;
    decimals?: number;
}

export default function AnimatedCounter({
    end,
    duration = 2000,
    suffix = '',
    prefix = '',
    className = '',
    decimals = 0,
}: AnimatedCounterProps) {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated) {
                        setHasAnimated(true);
                        animateCount();
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [hasAnimated]);

    const animateCount = () => {
        const startTime = performance.now();
        const startValue = 0;

        const updateCount = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation (easeOutExpo)
            const easeOutExpo = 1 - Math.pow(2, -10 * progress);
            const currentCount = startValue + (end - startValue) * easeOutExpo;

            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                setCount(end);
            }
        };

        requestAnimationFrame(updateCount);
    };

    const displayValue = decimals > 0
        ? count.toFixed(decimals)
        : Math.floor(count).toLocaleString('vi-VN');

    return (
        <span ref={ref} className={className}>
            {prefix}{displayValue}{suffix}
        </span>
    );
}
