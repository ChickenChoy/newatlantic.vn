-- Create admin_users table for role-based access control
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('super_admin', 'admin', 'editor', 'viewer')),
    avatar TEXT,
    is_active BOOLEAN DEFAULT true,
    totp_enabled BOOLEAN DEFAULT false,
    last_login TIMESTAMPTZ,
    invited_by TEXT,
    invited_at TIMESTAMPTZ,
    supabase_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_supabase_id ON admin_users(supabase_id);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role to do everything
CREATE POLICY "Service role has full access" ON admin_users
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Policy: Authenticated users can read their own data
CREATE POLICY "Users can read own data" ON admin_users
    FOR SELECT
    USING (auth.uid()::text = supabase_id::text OR auth.email() = email);

-- Policy: Super admins and admins can read all users
CREATE POLICY "Admins can read all users" ON admin_users
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.email = auth.email() 
            AND au.role IN ('super_admin', 'admin')
            AND au.is_active = true
        )
    );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default super admin (replace with your email)
INSERT INTO admin_users (email, name, role, is_active)
VALUES ('admin@newatlantic.vn', 'Super Admin', 'super_admin', true)
ON CONFLICT (email) DO NOTHING;
