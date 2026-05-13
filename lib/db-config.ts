/**
 * Database Configuration
 * Toggle between JSON file storage and Supabase
 */

// Set to 'supabase' to use Supabase, 'json' to use JSON files
export const DB_MODE: 'json' | 'supabase' = process.env.DB_MODE === 'supabase' ? 'supabase' : 'json';

export const isSupabaseEnabled = DB_MODE === 'supabase';

// Re-export database functions based on mode
// This allows gradual migration
export async function getDbFunctions() {
    if (isSupabaseEnabled) {
        return await import('./db-supabase');
    }
    return await import('./db-json');
}

// For synchronous imports (legacy support)
export * as jsonDb from './db-json';
export * as supabaseDb from './db-supabase';
