"use client";

import { useRef, useState, type ReactNode } from "react";

interface TiltCardProps {
    children: ReactNode;
    className?: string;
    tiltAmount?: number;
    glareEnabled?: boolean;
}

export function TiltCard({
    children,
    className = "",
    tiltAmount = 10,
    glareEnabled = true
}: TiltCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [transform, setTransform] = useState("");
    const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -tiltAmount;
        const rotateY = ((x - centerX) / centerX) * tiltAmount;

        setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
        setGlarePosition({
            x: (x / rect.width) * 100,
            y: (y / rect.height) * 100
        });
    };

    const handleMouseLeave = () => {
        setTransform("perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)");
        setGlarePosition({ x: 50, y: 50 });
    };

    return (
        <div
            ref={cardRef}
            className={`tilt-card ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transform,
                transition: "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                position: "relative",
                overflow: "hidden"
            }}
        >
            {children}
            {glareEnabled && (
                <div
                    className="tilt-card-glare"
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.3) 0%, transparent 60%)`,
                        pointerEvents: "none",
                        transition: "background 0.1s ease"
                    }}
                />
            )}
        </div>
    );
}
