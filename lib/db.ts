/**
 * Database wrapper - Re-exports from Supabase
 * This file provides backward compatibility for sync imports
 * but uses Supabase as the data source
 */

// Re-export all functions from db-supabase
export * from './db-supabase';

// Note: All functions from db-supabase are async
// Pages and components using these must handle promises appropriately
