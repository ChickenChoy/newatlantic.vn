'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Toast, ToastProps } from './micro-interactions';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

interface ToastContextType {
  showToast: (toast: Omit<ToastProps, 'onClose'>) => void;
  success: (message: string, options?: Partial<Omit<ToastProps, 'message' | 'type' | 'onClose'>>) => void;
  error: (message: string, options?: Partial<Omit<ToastProps, 'message' | 'type' | 'onClose'>>) => void;
  warning: (message: string, options?: Partial<Omit<ToastProps, 'message' | 'type' | 'onClose'>>) => void;
  info: (message: string, options?: Partial<Omit<ToastProps, 'message' | 'type' | 'onClose'>>) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [toasts, setToasts] = useState<Array<ToastProps & { id: number }>>([]);
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions | null;
    resolve: ((value: boolean) => void) | null;
  }>({
    isOpen: false,
    options: null,
    resolve: null,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = useCallback((toast: Omit<ToastProps, 'onClose'>) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...toast, id, onClose: () => removeToast(id) }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((message: string, options?: Partial<Omit<ToastProps, 'message' | 'type' | 'onClose'>>) =>
    showToast({ message, type: 'success', ...options }), [showToast]);

  const error = useCallback((message: string, options?: Partial<Omit<ToastProps, 'message' | 'type' | 'onClose'>>) =>
    showToast({ message, type: 'error', ...options }), [showToast]);

  const warning = useCallback((message: string, options?: Partial<Omit<ToastProps, 'message' | 'type' | 'onClose'>>) =>
    showToast({ message, type: 'warning', ...options }), [showToast]);

  const info = useCallback((message: string, options?: Partial<Omit<ToastProps, 'message' | 'type' | 'onClose'>>) =>
    showToast({ message, type: 'info', ...options }), [showToast]);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        options,
        resolve,
      });
    });
  }, []);

  const handleConfirmResponse = useCallback((confirmed: boolean) => {
    if (confirmState.resolve) {
      confirmState.resolve(confirmed);
    }
    setConfirmState({
      isOpen: false,
      options: null,
      resolve: null,
    });
  }, [confirmState.resolve]);

  const confirmButtonStyles: Record<string, string> = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    info: 'bg-[#5f7ab8] hover:bg-[#4a6199] text-white',
  };

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info, confirm }}>
      {children}

      {/* Render toasts using portal */}
      {mounted && toasts.map((toast) => (
        createPortal(
          <Toast
            key={toast.id}
            {...toast}
          />,
          document.body
        )
      ))}

      {/* Confirm Modal */}
      {mounted &&
        confirmState.isOpen &&
        confirmState.options &&
        createPortal(
          <div className="fixed inset-0 z-[100001] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => handleConfirmResponse(false)}
            />

            {/* Modal */}
            <div
              className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
              style={{
                animation: 'scaleIn 0.2s ease-out',
              }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {confirmState.options.title}
              </h3>
              <p className="text-gray-600 mb-6">{confirmState.options.message}</p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => handleConfirmResponse(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  {confirmState.options.cancelText || 'Hủy'}
                </button>
                <button
                  onClick={() => handleConfirmResponse(true)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    confirmButtonStyles[confirmState.options.type || 'info']
                  }`}
                >
                  {confirmState.options.confirmText || 'Xác nhận'}
                </button>
              </div>
            </div>

            <style jsx global>{`
              @keyframes scaleIn {
                from {
                  transform: scale(0.95);
                  opacity: 0;
                }
                to {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            `}</style>
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}
