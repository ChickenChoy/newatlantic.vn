import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'light' | 'dark';
    variant?: 'solid' | 'outline' | 'ghost' | 'link';
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    color = 'primary',
    variant = 'solid',
    className = '',
    children,
    ...props
}) => {
    const baseClasses = "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const sizeClasses = "px-5 py-2.5 rounded-[9px] text-sm"; // MatDash standard size

    const solidClasses = {
        primary: "bg-primary text-white hover:bg-primary-dark focus:ring-primary/50 shadow-[0_9px_17.5px_rgba(0,0,0,0.05)] hover:shadow-lg",
        secondary: "bg-secondary text-foreground hover:bg-secondary/80 focus:ring-secondary/50 shadow-sm",
        success: "bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500/50 shadow-[0_9px_17.5px_rgba(46,169,92,0.1)]",
        error: "bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-500/50 shadow-[0_9px_17.5px_rgba(255,102,146,0.1)]",
        warning: "bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500/50 shadow-[0_9px_17.5px_rgba(248,194,10,0.1)]",
        info: "bg-cyan-500 text-white hover:bg-cyan-600 focus:ring-cyan-500/50 shadow-[0_9px_17.5px_rgba(70,202,235,0.1)]",
        light: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus:ring-gray-200/50 shadow-sm",
        dark: "bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-800/50 shadow-lg",
    };

    const outlineClasses = {
        primary: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50",
        secondary: "border-2 border-secondary text-gray-700 hover:bg-secondary focus:ring-secondary/50",
        success: "border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white focus:ring-emerald-500/50",
        error: "border-2 border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white focus:ring-rose-500/50",
        warning: "border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white focus:ring-amber-500/50",
        info: "border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white focus:ring-cyan-500/50",
        light: "border-2 border-gray-200 text-gray-700 hover:bg-gray-50 focus:ring-gray-200/50",
        dark: "border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white focus:ring-gray-800/50",
    };

    const ghostClasses = {
        primary: "text-primary hover:bg-primary/10 focus:ring-primary/50",
        secondary: "text-gray-700 hover:bg-gray-100 focus:ring-gray-200/50",
        success: "text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500/50",
        error: "text-red-500 hover:bg-red-50 focus:ring-red-500/50",
        warning: "text-amber-600 hover:bg-amber-50 focus:ring-amber-500/50",
        info: "text-cyan-600 hover:bg-cyan-50 focus:ring-cyan-500/50",
        light: "text-gray-500 hover:bg-gray-100 focus:ring-gray-200/50",
        dark: "text-gray-800 hover:bg-gray-100 focus:ring-gray-800/50",
    };

    const linkClasses = {
        primary: "text-primary hover:underline p-0 h-auto rounded-none shadow-none",
        secondary: "text-gray-500 hover:underline p-0 h-auto rounded-none shadow-none",
        success: "text-emerald-600 hover:underline p-0 h-auto rounded-none shadow-none",
        error: "text-rose-600 hover:underline p-0 h-auto rounded-none shadow-none",
        warning: "text-amber-600 hover:underline p-0 h-auto rounded-none shadow-none",
        info: "text-cyan-600 hover:underline p-0 h-auto rounded-none shadow-none",
        light: "text-gray-400 hover:underline p-0 h-auto rounded-none shadow-none",
        dark: "text-gray-800 hover:underline p-0 h-auto rounded-none shadow-none",
    };

    let variantClasses = solidClasses[color] || solidClasses.primary;
    if (variant === 'outline') variantClasses = outlineClasses[color] || outlineClasses.primary;
    if (variant === 'ghost') variantClasses = ghostClasses[color] || ghostClasses.primary;
    if (variant === 'link') variantClasses = linkClasses[color] || linkClasses.primary;

    const finalSizeClasses = variant === 'link' ? '' : sizeClasses;

    return (
        <button
            className={`${baseClasses} ${finalSizeClasses} ${variantClasses} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
