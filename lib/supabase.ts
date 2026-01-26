import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function createClient() {
    return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Singleton instance for client-side
let browserClient: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseClient() {
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
