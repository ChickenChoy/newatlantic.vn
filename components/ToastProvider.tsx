'use client';

import { useEffect, useState, useCallback } from 'react';
import Toast, { useToast, setGlobalToastHandler, setGlobalConfirmHandler, ConfirmOptions } from './micro-interactions/Toast';
import ConfirmDialog from './micro-interactions/ConfirmDialog';

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const { toasts, removeToast, showToast } = useToast();
    const [confirmState, setConfirmState] = useState<{
        isOpen: boolean;
        options: ConfirmOptions;
        resolver: ((value: boolean) => void) | null;
    }>({
        isOpen: false,
        options: { message: '' },
        resolver: null,
    });

    // Set up global toast handler
    useEffect(() => {
        setGlobalToastHandler(showToast);
    }, [showToast]);

    // Set up global confirm handler
    const handleConfirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setConfirmState({
                isOpen: true,
                options,
                resolver: resolve,
            });
        });
    }, []);

    useEffect(() => {
        setGlobalConfirmHandler(handleConfirm);
    }, [handleConfirm]);

    // Handle confirm dialog actions
    const handleConfirmAction = useCallback(() => {
        confirmState.resolver?.(true);
        setConfirmState({
            isOpen: false,
            options: { message: '' },
            resolver: null,
        });
    }, [confirmState.resolver]);

    const handleCancelAction = useCallback(() => {
        confirmState.resolver?.(false);
        setConfirmState({
            isOpen: false,
            options: { message: '' },
            resolver: null,
        });
    }, [confirmState.resolver]);

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
            {/* Render confirm dialog */}
            <ConfirmDialog
                isOpen={confirmState.isOpen}
                title={confirmState.options.title}
                message={confirmState.options.message}
                confirmText={confirmState.options.confirmText}
                cancelText={confirmState.options.cancelText}
                type={confirmState.options.type}
                onConfirm={handleConfirmAction}
                onCancel={handleCancelAction}
            />
        </>
    );
}

// Re-export for convenience
export { useToast, toast } from './micro-interactions/Toast';
