'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Toast, ToastProps } from './micro-interactions';

interface ToastContextType {
  showToast: (toast: Omit<ToastProps, 'onClose'>) => void;
  success: (message: string, options?: Partial<Omit<ToastProps, 'message' | 'type' | 'onClose'>>) => void;
  error: (message: string, options?: Partial<Omit<ToastProps, 'message' | 'type' | 'onClose'>>) => void;
  warning: (message: string, options?: Partial<Omit<ToastProps, 'message' | 'type' | 'onClose'>>) => void;
  info: (message: string, options?: Partial<Omit<ToastProps, 'message' | 'type' | 'onClose'>>) => void;
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
  const [toasts, setToasts] = useState<Array<ToastProps & { id: number }>>([]);

  const showToast = (toast: Omit<ToastProps, 'onClose'>) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...toast, id, onClose: () => removeToast(id) }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const success = (message: string, options?: Partial<Omit<ToastProps, 'message' | 'type' | 'onClose'>>) =>
    showToast({ message, type: 'success', ...options });

  const error = (message: string, options?: Partial<Omit<ToastProps, 'message' | 'type' | 'onClose'>>) =>
    showToast({ message, type: 'error', ...options });

  const warning = (message: string, options?: Partial<Omit<ToastProps, 'message' | 'type' | 'onClose'>>) =>
    showToast({ message, type: 'warning', ...options });

  const info = (message: string, options?: Partial<Omit<ToastProps, 'message' | 'type' | 'onClose'>>) =>
    showToast({ message, type: 'info', ...options });

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      {/* Render toasts */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
        />
      ))}
    </ToastContext.Provider>
  );
}

