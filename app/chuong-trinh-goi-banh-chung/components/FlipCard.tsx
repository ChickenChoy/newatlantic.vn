"use client";

import { useState, type ReactNode } from "react";

interface FlipCardProps {
    front: ReactNode;
    back: ReactNode;
    className?: string;
    flipDirection?: "horizontal" | "vertical";
}

export function FlipCard({
    front,
    back,
    className = "",
}: FlipCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className={`${className}`}
            style={{
                position: "relative",
                cursor: "pointer",
            }}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            {/* Front - visible when not flipped */}
            <div
                className="flip-card-front"
                style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1.25rem",
                    borderRadius: "12px",
                    opacity: isFlipped ? 0 : 1,
                    transform: isFlipped ? "scale(0.95)" : "scale(1)",
                    transition: "opacity 0.3s ease, transform 0.3s ease",
                    pointerEvents: isFlipped ? "none" : "auto",
                }}
            >
                {front}
            </div>

            {/* Back - visible when flipped */}
            <div
                className="flip-card-back"
                style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1.25rem",
                    borderRadius: "12px",
                    opacity: isFlipped ? 1 : 0,
                    transform: isFlipped ? "scale(1)" : "scale(0.95)",
                    transition: "opacity 0.3s ease, transform 0.3s ease",
                    pointerEvents: isFlipped ? "auto" : "none",
                }}
            >
                {back}
            </div>
        </div>
    );
}
