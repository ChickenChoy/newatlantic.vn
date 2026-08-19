'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { EASE_BRAND } from '@/components/motion/ease';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  position?: ToastPosition;
  icon?: React.ReactNode;
}

export interface ToastEntry extends ToastProps {
  id: number;
}

// Confirm Dialog Types
export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

/* ------------------------------------------------------------------ *
 * Queue
 * ------------------------------------------------------------------ */

interface ToastContextValue {
  showToast: (toast: ToastProps) => void;
  removeToast: (id: number) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

/**
 * Deliberately carries only the stable callbacks, never the toast array:
 * two dozen components call useToast(), and none of them need to re-render
 * when a toast appears somewhere else on the page.
 */
export const ToastContext = createContext<ToastContextValue | null>(null);

let nextToastId = 0;

/**
 * Owns the toast queue. Called exactly once, by ToastProvider.
 *
 * Everything else goes through useToast(), which reaches this same queue over
 * context. That indirection is the whole point: useToast() used to call
 * useState itself, so each of the 24 components using it got a private array
 * and pushed toasts into state that nothing ever rendered.
 */
export function useToastStore() {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const showToast = useCallback((toast: ToastProps) => {
    // A counter, not Date.now(): two toasts fired in the same millisecond
    // would otherwise share a React key and only one would render.
    const id = nextToastId++;
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
}

/* ------------------------------------------------------------------ *
 * Presentation
 * ------------------------------------------------------------------ */

const POSITIONS: ToastPosition[] = [
  'top-right',
  'top-left',
  'top-center',
  'bottom-right',
  'bottom-left',
  'bottom-center',
];

/**
 * Each corner is its own flex column. Stacking used to be a hardcoded 76px
 * step per toast, which overlapped as soon as a message wrapped to two lines;
 * normal flow measures the real height instead.
 */
const CONTAINER_STYLES: Record<ToastPosition, string> = {
  'top-right': 'top-4 right-4 items-end',
  'top-left': 'top-4 left-4 items-start',
  'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
  'bottom-right': 'bottom-4 right-4 items-end',
  'bottom-left': 'bottom-4 left-4 items-start',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
};

/** Offset a toast slides in from, and back out to, per position. */
const ENTER_OFFSET: Record<ToastPosition, { x?: number; y?: number }> = {
  'top-right': { x: 32 },
  'top-left': { x: -32 },
  'top-center': { y: -32 },
  'bottom-right': { x: 32 },
  'bottom-left': { x: -32 },
  'bottom-center': { y: 32 },
};

/**
 * State is carried by a single accent rail and the icon, on the same white
 * card as the rest of the site. Gradient-filled toasts read as a different
 * product next to the navy/orange system.
 */
const TYPE_STYLES: Record<ToastType, { rail: string; icon: string; tile: string }> = {
  success: { rail: 'bg-success', icon: 'text-success', tile: 'bg-success/10' },
  error: { rail: 'bg-error', icon: 'text-error', tile: 'bg-error/10' },
  warning: { rail: 'bg-warning', icon: 'text-warning', tile: 'bg-warning/10' },
  info: { rail: 'bg-navy', icon: 'text-navy', tile: 'bg-surface' },
};

const TYPE_ICONS: Record<ToastType, React.ReactNode> = {
  success: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

interface ToastCardProps {
  entry: ToastEntry;
  offset: { x?: number; y?: number };
  reduceMotion: boolean;
  onDismiss: () => void;
}

function ToastCard({ entry, offset, reduceMotion, onDismiss }: ToastCardProps) {
  const { message, type = 'info', duration = 3500, icon } = entry;
  const styles = TYPE_STYLES[type];

  // Held in a ref so re-parenting or a new inline onDismiss never restarts
  // the countdown mid-flight.
  const dismissRef = useRef(onDismiss);
  useEffect(() => {
    dismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => dismissRef.current(), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <motion.div
      // Position only: a full layout animation animates size via scale, which
      // would smear the state rail and the border radius while the stack
      // reflows after a toast above this one is dismissed.
      layout="position"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, ...offset }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, ...offset }}
      transition={{ duration: reduceMotion ? 0.15 : 0.3, ease: EASE_BRAND }}
      className="pointer-events-auto relative flex w-full items-center gap-3 overflow-hidden rounded-card border border-navy/14 bg-white py-3.5 pl-4 pr-3.5 shadow-xl"
    >
      {/* State rail */}
      <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-[3px] ${styles.rail}`} />

      {/* Icon */}
      <div
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-card ${styles.tile} ${styles.icon}`}
      >
        {icon || TYPE_ICONS[type]}
      </div>

      {/* Message */}
      <p className="min-w-0 flex-1 text-sm font-medium leading-[1.5] text-navy">{message}</p>

      {/* Close button */}
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Đóng thông báo"
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-card text-navy/40 transition-colors duration-300 ease-brand hover:bg-surface hover:text-accent"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Auto-dismiss countdown */}
      {duration > 0 && !reduceMotion && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden bg-navy/10">
          <div
            className={`animate-toast-progress h-full ${styles.rail}`}
            style={{ '--toast-duration': `${duration}ms` } as React.CSSProperties}
          />
        </div>
      )}
    </motion.div>
  );
}

/**
 * Renders one fixed column per screen corner. Rendered by ToastProvider.
 */
export function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastEntry[];
  onDismiss: (id: number) => void;
}) {
  const reduceMotion = !!useReducedMotion();

  return (
    <>
      {POSITIONS.map((position) => {
        const group = toasts.filter((t) => (t.position ?? 'top-right') === position);

        return (
          <div
            key={position}
            // Mounted even while empty: a live region has to exist before
            // content lands in it, otherwise screen readers miss the
            // announcement entirely.
            aria-live={group.some((t) => t.type === 'error') ? 'assertive' : 'polite'}
            className={`pointer-events-none fixed z-[100000] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3 ${CONTAINER_STYLES[position]}`}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {group.map((entry) => (
                <ToastCard
                  key={entry.id}
                  entry={entry}
                  offset={ENTER_OFFSET[position]}
                  reduceMotion={reduceMotion}
                  onDismiss={() => {
                    entry.onClose?.();
                    onDismiss(entry.id);
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ *
 * Imperative API
 * ------------------------------------------------------------------ */

let globalToastHandler: ((toast: ToastProps) => void) | null = null;
let globalConfirmHandler: ((options: ConfirmOptions) => Promise<boolean>) | null = null;

export function setGlobalToastHandler(handler: (toast: ToastProps) => void) {
  globalToastHandler = handler;
}

export function setGlobalConfirmHandler(handler: (options: ConfirmOptions) => Promise<boolean>) {
  globalConfirmHandler = handler;
}

/**
 * Hook form of the toast API. Reads the queue owned by ToastProvider off
 * context; falls back to the imperative handler if used outside one.
 */
export function useToast() {
  const ctx = useContext(ToastContext);

  const showToast = useCallback(
    (toast: ToastProps) => {
      if (ctx) {
        ctx.showToast(toast);
        return;
      }
      globalToastHandler?.(toast);
    },
    [ctx]
  );

  const confirm = useCallback(
    (options: ConfirmOptions): Promise<boolean> => {
      if (ctx) return ctx.confirm(options);
      if (!globalConfirmHandler) {
        console.error('Confirm handler not set. Make sure ToastProvider is mounted.');
        return Promise.resolve(false);
      }
      return globalConfirmHandler(options);
    },
    [ctx]
  );

  return useMemo(
    () => ({
      showToast,
      confirm,
      success: (message: string, options?: Partial<ToastProps>) =>
        showToast({ message, type: 'success', ...options }),
      error: (message: string, options?: Partial<ToastProps>) =>
        showToast({ message, type: 'error', ...options }),
      warning: (message: string, options?: Partial<ToastProps>) =>
        showToast({ message, type: 'warning', ...options }),
      info: (message: string, options?: Partial<ToastProps>) =>
        showToast({ message, type: 'info', ...options }),
    }),
    [showToast, confirm]
  );
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
