/**
 * Toast Utility
 * Centralized toast notification helper to avoid repeated dynamic imports
 */

import { toast as toastFn } from '@/components/ToastProvider';

/**
 * Show a toast notification
 * @example
 * showToast.success('Item added to wishlist');
 * showToast.error('Failed to save');
 * showToast.info('Changes saved');
 * showToast.warning('Please review your input');
 * showToast.success('Done!', { duration: 5000 });
 */
export const showToast = {
  success: (message: string, options?: { duration?: number }) => {
    toastFn.success(message, options);
  },
  error: (message: string, options?: { duration?: number }) => {
    toastFn.error(message, options);
  },
  info: (message: string, options?: { duration?: number }) => {
    toastFn.info(message, options);
  },
  warning: (message: string, options?: { duration?: number }) => {
    toastFn.warning(message, options);
  },
};

// Re-export the original toast function for advanced use cases
export { toast } from '@/components/ToastProvider';
