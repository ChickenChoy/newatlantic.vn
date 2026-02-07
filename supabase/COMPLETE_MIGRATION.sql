-- ========================================
-- NEW ATLANTIC COMPLETE DATABASE MIGRATION
-- File tổng hợp TẤT CẢ migrations để import vào Supabase
-- Tạo ngày: 2026-02-06
-- Version: 2.0 - Safe to re-run
-- ========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- PART 1: MISSING TABLES
-- ========================================

-- 1. SERVICES TABLE
CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    image TEXT,
    order_index INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_enabled ON services(enabled);

-- 2. PARTNERS TABLE
CREATE TABLE IF NOT EXISTS partners (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    name TEXT NOT NULL,
    logo TEXT,
    url TEXT,
    order_index INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_partners_enabled ON partners(enabled);

-- 3. SOCIAL LINKS TABLE
CREATE TABLE IF NOT EXISTS social_links (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    platform TEXT NOT NULL CHECK (platform IN ('facebook', 'youtube', 'linkedin', 'zalo', 'instagram', 'twitter', 'tiktok')),
    url TEXT NOT NULL,
    enabled BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_links_platform ON social_links(platform);
CREATE INDEX IF NOT EXISTS idx_social_links_enabled ON social_links(enabled);

-- ========================================
-- PART 2: ADMIN USERS TABLE
-- ========================================

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

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_supabase_id ON admin_users(supabase_id);

-- Enable RLS for admin_users (safe to re-run)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate
DO $$
BEGIN
    -- Drop policies for admin_users
    DROP POLICY IF EXISTS "Service role has full access" ON admin_users;
    DROP POLICY IF EXISTS "Users can read own data" ON admin_users;
    DROP POLICY IF EXISTS "Admins can read all users" ON admin_users;
END $$;

-- Recreate policies for admin_users
CREATE POLICY "Service role has full access" ON admin_users
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Users can read own data" ON admin_users
    FOR SELECT
    USING (auth.uid()::text = supabase_id::text OR auth.email() = email);

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

-- ========================================
-- PART 3: GLOBAL PARTNERS TABLES
-- ========================================

-- Global Partner Regions Table
CREATE TABLE IF NOT EXISTS global_partner_regions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_vi TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Global Partners Table
CREATE TABLE IF NOT EXISTS global_partners (
    id TEXT PRIMARY KEY,
    region_id TEXT REFERENCES global_partner_regions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    country TEXT,
    logo TEXT,
    url TEXT,
    order_index INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for global partners
CREATE INDEX IF NOT EXISTS idx_global_partners_region_id ON global_partners(region_id);
CREATE INDEX IF NOT EXISTS idx_global_partner_regions_order ON global_partner_regions(order_index);
CREATE INDEX IF NOT EXISTS idx_global_partners_order ON global_partners(order_index);

-- Enable RLS
ALTER TABLE global_partner_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_partners ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate
DO $$
BEGIN
    -- Drop policies for global_partner_regions
    DROP POLICY IF EXISTS "Allow public read access on global_partner_regions" ON global_partner_regions;
    DROP POLICY IF EXISTS "Allow authenticated insert on global_partner_regions" ON global_partner_regions;
    DROP POLICY IF EXISTS "Allow authenticated update on global_partner_regions" ON global_partner_regions;
    DROP POLICY IF EXISTS "Allow authenticated delete on global_partner_regions" ON global_partner_regions;

    -- Drop policies for global_partners
    DROP POLICY IF EXISTS "Allow public read access on global_partners" ON global_partners;
    DROP POLICY IF EXISTS "Allow authenticated insert on global_partners" ON global_partners;
    DROP POLICY IF EXISTS "Allow authenticated update on global_partners" ON global_partners;
    DROP POLICY IF EXISTS "Allow authenticated delete on global_partners" ON global_partners;
END $$;

-- Recreate policies for global_partner_regions
CREATE POLICY "Allow public read access on global_partner_regions"
    ON global_partner_regions FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated insert on global_partner_regions"
    ON global_partner_regions FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update on global_partner_regions"
    ON global_partner_regions FOR UPDATE
    USING (true);

CREATE POLICY "Allow authenticated delete on global_partner_regions"
    ON global_partner_regions FOR DELETE
    USING (true);

-- Recreate policies for global_partners
CREATE POLICY "Allow public read access on global_partners"
    ON global_partners FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated insert on global_partners"
    ON global_partners FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update on global_partners"
    ON global_partners FOR UPDATE
    USING (true);

CREATE POLICY "Allow authenticated delete on global_partners"
    ON global_partners FOR DELETE
    USING (true);

-- ========================================
-- PART 4: ADD MISSING COLUMNS
-- ========================================

-- Add 'image' column to products table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'products' AND column_name = 'image'
    ) THEN
        ALTER TABLE products ADD COLUMN image TEXT;
        -- Copy thumbnail values to image for existing rows
        UPDATE products SET image = thumbnail WHERE thumbnail IS NOT NULL;
    END IF;
END $$;

-- Create or replace trigger function for product image sync
CREATE OR REPLACE FUNCTION sync_product_image()
RETURNS TRIGGER AS $sync$
BEGIN
    -- If image is updated, update thumbnail
    IF NEW.image IS DISTINCT FROM OLD.image THEN
        NEW.thumbnail = NEW.image;
    END IF;
    -- If thumbnail is updated, update image
    IF NEW.thumbnail IS DISTINCT FROM OLD.thumbnail THEN
        NEW.image = NEW.thumbnail;
    END IF;
    RETURN NEW;
END;
$sync$ LANGUAGE plpgsql;

-- Drop and recreate trigger for product image sync
DROP TRIGGER IF EXISTS product_image_sync ON products;
CREATE TRIGGER product_image_sync
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION sync_product_image();

-- ========================================
-- PART 5: HELPER FUNCTIONS & TRIGGERS
-- ========================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop and recreate triggers
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_global_partner_regions_updated_at ON global_partner_regions;
CREATE TRIGGER update_global_partner_regions_updated_at
    BEFORE UPDATE ON global_partner_regions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_global_partners_updated_at ON global_partners;
CREATE TRIGGER update_global_partners_updated_at
    BEFORE UPDATE ON global_partners
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- PART 6: DEFAULT DATA
-- ========================================

-- Insert default admin user
INSERT INTO admin_users (email, name, role, is_active)
VALUES ('admin@newatlantic.vn', 'Super Admin', 'super_admin', true)
ON CONFLICT (email) DO NOTHING;

-- Insert default regions
INSERT INTO global_partner_regions (id, name, name_vi, order_index, enabled) VALUES
    ('north-america', 'North America', 'Bắc Mỹ', 0, true),
    ('europe', 'Europe', 'Châu Âu', 1, true),
    ('middle-east', 'Middle East', 'Trung Đông', 2, true),
    ('asia', 'Asia', 'Châu Á', 3, true),
    ('southeast-asia', 'Southeast Asia', 'Đông Nam Á', 4, true)
ON CONFLICT (id) DO NOTHING;

-- Insert default partners
INSERT INTO global_partners (id, region_id, name, country, order_index, enabled) VALUES
    ('willburt', 'north-america', 'WILL-BURT (USA)', 'USA', 0, true),
    ('moffett', 'north-america', 'Moffett (USA)', 'USA', 1, true),
    ('hiab', 'europe', 'HIAB (Sweden)', 'Sweden', 0, true),
    ('effer', 'europe', 'EFFER (Italy)', 'Italy', 1, true),
    ('clarkmasts', 'europe', 'Clark Masts (UK)', 'UK', 2, true),
    ('petronas', 'middle-east', 'Petronas', 'Malaysia', 0, true),
    ('skymark', 'asia', 'SKYMARK', 'South Korea', 0, true),
    ('lovol', 'asia', 'LOVOL (China)', 'China', 1, true),
    ('eldis', 'asia', 'Eldis (Czech)', 'Czech Republic', 2, true),
    ('stairborne', 'asia', 'ST Airborne', 'Singapore', 3, true),
    ('newatlantic', 'southeast-asia', 'NEW ATLANTIC (Vietnam) 🇻🇳', 'Vietnam', 0, true)
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================
-- Uncomment để kiểm tra sau khi chạy migration:

-- Check all new tables created
SELECT
    'Tables Created' as status,
    COUNT(*) as count
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('services', 'partners', 'social_links', 'admin_users', 'global_partner_regions', 'global_partners');

-- Check products table has 'image' column
SELECT
    'Products Columns' as status,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'products'
AND column_name IN ('image', 'thumbnail');

-- Count records in new tables
SELECT
    'Data Summary' as status,
    (SELECT COUNT(*) FROM admin_users) as admin_users,
    (SELECT COUNT(*) FROM global_partner_regions) as regions,
    (SELECT COUNT(*) FROM global_partners) as partners,
    (SELECT COUNT(*) FROM services) as services,
    (SELECT COUNT(*) FROM social_links) as social_links;

-- ========================================
-- MIGRATION COMPLETE ✅
-- ========================================
-- Version 2.0 - Safe to re-run
-- Tất cả bảng thiếu đã được tạo
-- Tất cả RLS policies đã được thiết lập
-- Tất cả triggers đã được tạo
-- Default data đã được insert
-- ========================================
