-- Create page_views table for self-hosted analytics
CREATE TABLE IF NOT EXISTS page_views (
    id BIGSERIAL PRIMARY KEY,
    path TEXT NOT NULL,
    session_id TEXT NOT NULL,
    user_agent TEXT DEFAULT '',
    ip TEXT DEFAULT '',
    referrer TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views (session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views (path);

-- Create daily_stats materialized view for fast aggregation (optional, for large datasets)
-- We'll use direct queries initially

-- Enable RLS (but allow service role to bypass)
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Policy: only service role can insert/select (server-side only)
CREATE POLICY "Service role can manage page_views" ON page_views
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Auto-cleanup: delete records older than 90 days (optional)
-- You can set up a cron job in Supabase for this
