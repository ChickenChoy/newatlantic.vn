"use client";

import { useState } from "react";
import Link from "next/link";

interface Action {
    icon: string;
    label: string;
    href?: string;
    onClick?: () => void;
}

interface FloatingActionMenuProps {
    actions: Action[];
}

export function FloatingActionMenu({ actions }: FloatingActionMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleActionClick = (onClick?: () => void) => {
        if (onClick) {
            onClick();
        }
        setIsOpen(false);
    };

    return (
        <div className={`fab-menu ${isOpen ? "open" : ""}`}>
            <button
                className="fab-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Đóng menu" : "Mở menu"}
                aria-expanded={isOpen}
            >
                <span className="fab-icon">
                    {isOpen ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    )}
                </span>
            </button>

            <div className="fab-actions">
                {actions.map((action, index) => (
                    <div
                        key={index}
                        className="fab-action-wrapper"
                        style={{ transitionDelay: `${index * 50}ms` }}
                    >
                        {action.href ? (
                            <Link
                                href={action.href}
                                className="fab-action"
                                onClick={() => handleActionClick(action.onClick)}
                            >
                                <span className="fab-action-icon">{action.icon}</span>
                                <span className="fab-action-label">{action.label}</span>
                            </Link>
                        ) : (
                            <button
                                className="fab-action"
                                onClick={() => handleActionClick(action.onClick)}
                            >
                                <span className="fab-action-icon">{action.icon}</span>
                                <span className="fab-action-label">{action.label}</span>
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
