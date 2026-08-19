'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import {
    ToastContext,
    ToastViewport,
    useToastStore,
    setGlobalToastHandler,
    setGlobalConfirmHandler,
    type ConfirmOptions,
} from './micro-interactions/Toast';
import ConfirmDialog from './micro-interactions/ConfirmDialog';

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const { toasts, showToast, removeToast } = useToastStore();
    const [confirmState, setConfirmState] = useState<{
        isOpen: boolean;
        options: ConfirmOptions;
        resolver: ((value: boolean) => void) | null;
    }>({
        isOpen: false,
        options: { message: '' },
        resolver: null,
    });

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

    // The `toast.*` / `showToast.*` imperative helpers are used from ~250 call
    // sites that are not React components, so the handlers stay registered
    // module-side alongside the context.
    useEffect(() => {
        setGlobalToastHandler(showToast);
    }, [showToast]);

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

    // Stable across the provider's lifetime -- the toast array is deliberately
    // left out so that showing a toast does not re-render every consumer.
    const contextValue = useMemo(
        () => ({ showToast, removeToast, confirm: handleConfirm }),
        [showToast, removeToast, handleConfirm]
    );

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <ToastViewport toasts={toasts} onDismiss={removeToast} />
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
        </ToastContext.Provider>
    );
}

// Re-export for convenience
export { useToast, toast } from './micro-interactions/Toast';
export type { ToastProps, ToastType, ToastPosition, ConfirmOptions } from './micro-interactions/Toast';
