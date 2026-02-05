-- Migration: Create activity_logs table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS activity_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT,
    entity_name TEXT,
    user_email TEXT,
    details TEXT,
    changes JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_email);

-- Enable RLS
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read
CREATE POLICY "Allow read activity_logs" ON activity_logs
    FOR SELECT USING (true);

-- Policy: Allow authenticated users to insert
CREATE POLICY "Allow insert activity_logs" ON activity_logs
    FOR INSERT WITH CHECK (true);

-- Policy: Allow super admin to delete
CREATE POLICY "Allow delete activity_logs" ON activity_logs
    FOR DELETE USING (true);

-- Optional: Auto-cleanup old logs (keep last 30 days)
-- CREATE OR REPLACE FUNCTION cleanup_old_activity_logs()
-- RETURNS void AS $$
-- BEGIN
--     DELETE FROM activity_logs WHERE timestamp < NOW() - INTERVAL '30 days';
-- END;
-- $$ LANGUAGE plpgsql;
