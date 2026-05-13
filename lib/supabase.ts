import { createBrowserClient, createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

function shouldWarnMissingSupabase(): boolean {
    return process.env.DB_MODE === 'supabase';
}

// Lazy evaluation of environment variables
function getSupabaseUrl(): string {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url && shouldWarnMissingSupabase()) {
        console.warn('NEXT_PUBLIC_SUPABASE_URL is not configured');
        return '';
    }
    return url || '';
}

function getSupabaseAnonKey(): string {
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!key && shouldWarnMissingSupabase()) {
        console.warn('NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured');
        return '';
    }
    return key || '';
}

function getSupabaseServiceRoleKey(): string {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!key && shouldWarnMissingSupabase()) {
        console.warn('SUPABASE_SERVICE_ROLE_KEY is not configured');
        return '';
    }
    return key || '';
}

export function createClient() {
    const supabaseUrl = getSupabaseUrl();
    const supabaseAnonKey = getSupabaseAnonKey();

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase credentials not configured');
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Create admin client with service role key for server-side operations
// WARNING: Only use this on the server, never expose service role key to client
export function createAdminClient() {
    const supabaseUrl = getSupabaseUrl();
    const serviceRoleKey = getSupabaseServiceRoleKey();

    if (!supabaseUrl || !serviceRoleKey) {
        if (!shouldWarnMissingSupabase()) return null;
        console.error('Supabase admin client: Missing URL or service role key');
        return null;
    }

    return createSupabaseClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
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
