'use client';

import { useEffect } from 'react';
import Toast, { useToast, setGlobalToastHandler } from './micro-interactions/Toast';

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const { toasts, removeToast, showToast } = useToast();

    // Set up global toast handler
    useEffect(() => {
        setGlobalToastHandler(showToast);
    }, [showToast]);

    return (
        <>
            {children}
            {/* Render all active toasts */}
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    position={toast.position}
                    icon={toast.icon}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </>
    );
}

// Re-export for convenience
export { useToast, toast } from './micro-interactions/Toast';
