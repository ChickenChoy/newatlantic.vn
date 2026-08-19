'use client';

import { useEffect, useState, useRef } from 'react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title = 'Xác nhận',
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  type = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
      // Focus on cancel button by default for safety
      setTimeout(() => cancelButtonRef.current?.focus(), 100);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  // Handle keyboard events
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      } else if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        onConfirm();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onConfirm, onCancel]);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isVisible) return null;

  const typeStyles = {
    danger: {
      icon: {
        bg: 'bg-error/10',
        text: 'text-error',
        svg: (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        ),
      },
      confirmButton: 'bg-error text-white hover:bg-error/90 focus:ring-error',
    },
    warning: {
      icon: {
        bg: 'bg-warning/10',
        text: 'text-warning',
        svg: (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        ),
      },
      confirmButton: 'bg-warning text-white hover:bg-warning/90 focus:ring-warning',
    },
    info: {
      icon: {
        bg: 'bg-surface',
        text: 'text-navy',
        svg: (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      confirmButton: 'bg-navy text-white hover:bg-accent focus:ring-accent',
    },
  };

  const styles = typeStyles[type];

  return (
    <div
      className={`fixed inset-0 z-[100001] flex items-center justify-center p-4 transition-opacity duration-300 ease-brand ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onCancel}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        className={`relative w-full max-w-md rounded-card border border-navy/14 bg-white shadow-xl transition-all duration-300 ease-brand ${
          isAnimating ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        {/* Content */}
        <div className="p-6">
          {/* Icon */}
          <div className={`mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-card ${styles.icon.bg} ${styles.icon.text}`}>
            {styles.icon.svg}
          </div>

          {/* Title */}
          <h3
            id="confirm-dialog-title"
            className="text-center font-display text-d6 uppercase leading-display tracking-display text-navy"
          >
            {title}
          </h3>

          {/* Message */}
          <p
            id="confirm-dialog-description"
            className="mx-auto mt-3 mb-6 max-w-sm text-center text-sm leading-[1.6] text-ink"
          >
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              ref={cancelButtonRef}
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-pill border border-navy/14 bg-white px-4 py-2.5 text-sm font-semibold text-navy transition-colors duration-300 ease-brand hover:border-navy focus:outline-none focus:ring-2 focus:ring-navy/40 focus:ring-offset-2"
            >
              {cancelText}
            </button>
            <button
              ref={confirmButtonRef}
              type="button"
              onClick={onConfirm}
              className={`flex-1 rounded-pill px-4 py-2.5 text-sm font-semibold transition-colors duration-300 ease-brand focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.confirmButton}`}
            >
              {confirmText}
            </button>
          </div>
        </div>

        {/* Keyboard hint */}
        <div className="border-t border-navy/14 px-6 py-3">
          <p className="text-center text-[11px] uppercase tracking-wide text-muted">
            ESC để hủy • Ctrl+Enter để xác nhận
          </p>
        </div>
      </div>
    </div>
  );
}
