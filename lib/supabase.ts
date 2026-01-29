import { createBrowserClient } from '@supabase/ssr'

// Lazy evaluation of environment variables
function getSupabaseUrl(): string {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url) {
        console.warn('NEXT_PUBLIC_SUPABASE_URL is not configured');
        return '';
    }
    return url;
}

function getSupabaseAnonKey(): string {
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!key) {
        console.warn('NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured');
        return '';
    }
    return key;
}

export function createClient() {
    const supabaseUrl = getSupabaseUrl();
    const supabaseAnonKey = getSupabaseAnonKey();

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase credentials not configured');
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Singleton instance for client-side
let browserClient: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseClient() {
    const supabaseUrl = getSupabaseUrl();
    const supabaseAnonKey = getSupabaseAnonKey();

    if (!supabaseUrl || !supabaseAnonKey) {
        return null;
    }

    if (typeof window === 'undefined') {
        // Server-side: create new client each time
        return createClient()
    }

    // Client-side: reuse singleton
    if (!browserClient) {
        browserClient = createClient()
    }
    return browserClient
}