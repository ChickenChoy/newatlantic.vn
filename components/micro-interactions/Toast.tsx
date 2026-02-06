'use client';

import { useEffect, useState } from 'react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  icon?: React.ReactNode;
}

export default function Toast({
  message,
  type = 'info',
  duration = 3500,
  onClose,
  position = 'top-right',
  icon,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Entrance animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto close
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  // Premium gradient styles for each type
  const typeStyles = {
    success: {
      bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      shadow: 'rgba(16, 185, 129, 0.3)',
      iconBg: 'rgba(255, 255, 255, 0.2)',
    },
    error: {
      bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      shadow: 'rgba(239, 68, 68, 0.3)',
      iconBg: 'rgba(255, 255, 255, 0.2)',
    },
    warning: {
      bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      shadow: 'rgba(245, 158, 11, 0.3)',
      iconBg: 'rgba(255, 255, 255, 0.2)',
    },
    info: {
      bg: 'linear-gradient(135deg, #3b5998 0%, #5a7fc2 100%)',
      shadow: 'rgba(59, 89, 152, 0.3)',
      iconBg: 'rgba(255, 255, 255, 0.2)',
    },
  };

  const typeIcons = {
    success: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  const positionStyles = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  const enterAnimation = {
    'top-right': 'translate-x-0',
    'top-left': 'translate-x-0',
    'bottom-right': 'translate-x-0',
    'bottom-left': 'translate-x-0',
    'top-center': 'translate-y-0 -translate-x-1/2',
    'bottom-center': 'translate-y-0 -translate-x-1/2',
  };

  const exitAnimation = {
    'top-right': 'translate-x-full',
    'top-left': '-translate-x-full',
    'bottom-right': 'translate-x-full',
    'bottom-left': '-translate-x-full',
    'top-center': '-translate-y-full -translate-x-1/2',
    'bottom-center': 'translate-y-full -translate-x-1/2',
  };

  const styles = typeStyles[type];

  return (
    <div
      className={`
        fixed z-[100000] rounded-2xl
        flex items-center gap-3 min-w-[320px] max-w-md
        transition-all duration-300 ease-out
        ${positionStyles[position]}
        ${isVisible && !isLeaving ? `opacity-100 ${enterAnimation[position]}` : `opacity-0 ${exitAnimation[position]}`}
      `}
      style={{
        background: styles.bg,
        boxShadow: `0 10px 40px -10px ${styles.shadow}, 0 0 0 1px rgba(255, 255, 255, 0.1) inset`,
        padding: '14px 18px',
      }}
    >
      {/* Icon with background */}
      <div
        className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: styles.iconBg }}
      >
        <span className="text-white">
          {icon || typeIcons[type]}
        </span>
      </div>

      {/* Message */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white leading-tight">
          {message}
        </p>
      </div>

      {/* Close button */}
      <button
        onClick={handleClose}
        className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Progress bar */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full overflow-hidden bg-white/10">
          <div
            className="h-full bg-white/40 rounded-full animate-toast-progress"
            style={{
              animationDuration: `${duration}ms`,
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes toast-progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        .animate-toast-progress {
          animation: toast-progress linear forwards;
        }
      `}</style>
    </div>
  );
}

// Confirm Dialog Types
export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

// Global Toast and Confirm handlers
let globalToastHandler: ((toast: ToastProps) => void) | null = null;
let globalConfirmHandler: ((options: ConfirmOptions) => Promise<boolean>) | null = null;

export function setGlobalToastHandler(handler: (toast: ToastProps) => void) {
  globalToastHandler = handler;
}

export function setGlobalConfirmHandler(handler: (options: ConfirmOptions) => Promise<boolean>) {
  globalConfirmHandler = handler;
}

// Toast Manager Hook
export function useToast() {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: number }>>([]);

  const showToast = (toast: ToastProps) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    if (!globalConfirmHandler) {
      console.error('Confirm handler not set. Make sure ToastProvider is mounted.');
      return Promise.resolve(false);
    }
    return globalConfirmHandler(options);
  };

  return {
    toasts,
    showToast,
    removeToast,
    success: (message: string, options?: Partial<ToastProps>) =>
      showToast({ message, type: 'success', ...options }),
    error: (message: string, options?: Partial<ToastProps>) =>
      showToast({ message, type: 'error', ...options }),
    warning: (message: string, options?: Partial<ToastProps>) =>
      showToast({ message, type: 'warning', ...options }),
    info: (message: string, options?: Partial<ToastProps>) =>
      showToast({ message, type: 'info', ...options }),
    confirm,
  };
}

export const toast = {
  success: (message: string, options?: Partial<ToastProps>) => {
    globalToastHandler?.({ message, type: 'success', ...options });
  },
  error: (message: string, options?: Partial<ToastProps>) => {
    globalToastHandler?.({ message, type: 'error', ...options });
  },
  warning: (message: string, options?: Partial<ToastProps>) => {
    globalToastHandler?.({ message, type: 'warning', ...options });
  },
  info: (message: string, options?: Partial<ToastProps>) => {
    globalToastHandler?.({ message, type: 'info', ...options });
  },
  confirm: (options: ConfirmOptions): Promise<boolean> => {
    if (!globalConfirmHandler) {
      console.error('Confirm handler not set. Make sure ToastProvider is mounted.');
      return Promise.resolve(false);
    }
    return globalConfirmHandler(options);
  },
};
