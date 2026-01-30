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
    flipDirection = "horizontal"
}: FlipCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className={`flip-card-wrapper ${className}`}
            style={{
                perspective: "1000px",
                cursor: "pointer"
            }}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div
                className={`flip-card-inner ${isFlipped ? "flipped" : ""}`}
                style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                    transformStyle: "preserve-3d",
                    transform: isFlipped
                        ? flipDirection === "horizontal"
                            ? "rotateY(180deg)"
                            : "rotateX(180deg)"
                        : "none"
                }}
            >
                {/* Front */}
                <div
                    className="flip-card-front"
                    style={{
                        position: "absolute",
                        inset: 0,
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden"
                    }}
                >
                    {front}
                </div>

                {/* Back */}
                <div
                    className="flip-card-back"
                    style={{
                        position: "absolute",
                        inset: 0,
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: flipDirection === "horizontal" ? "rotateY(180deg)" : "rotateX(180deg)"
                    }}
                >
                    {back}
                </div>
            </div>
        </div>
    );
}
