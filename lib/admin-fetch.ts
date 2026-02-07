/**
 * Admin Fetch Utility
 * Ensures all API calls from admin panel bypass browser cache
 * to always get fresh data from Supabase.
 */

/**
 * Fetch wrapper that bypasses all caching layers:
 * - Browser HTTP cache
 * - Next.js fetch cache
 * - Service worker cache
 * 
 * Usage:
 *   import { adminFetch } from '@/lib/admin-fetch';
 *   const res = await adminFetch('/api/products');
 */
export function adminFetch(url: string, options?: RequestInit): Promise<Response> {
    const separator = url.includes('?') ? '&' : '?';
    const cacheBustUrl = `${url}${separator}_t=${Date.now()}`;
    return fetch(cacheBustUrl, {
        ...options,
        cache: 'no-store',
        headers: {
            ...options?.headers,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
        },
    });
}
