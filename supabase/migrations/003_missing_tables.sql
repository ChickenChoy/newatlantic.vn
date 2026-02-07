-- ========================================
-- MISSING TABLES MIGRATION
-- Creates 4 missing tables to complete schema
-- ========================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- 1. SERVICES TABLE
-- ========================================
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

-- ========================================
-- 2. PARTNERS TABLE (Simple Version)
-- ========================================
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

-- ========================================
-- 3. SOCIAL LINKS TABLE
-- ========================================
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
-- 4. ADD MISSING COLUMN TO PRODUCTS
-- Fix: TypeScript expects 'image' field
-- ========================================
-- Add 'image' column as alias to 'thumbnail' for backward compatibility
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'products' AND column_name = 'image'
    ) THEN
        ALTER TABLE products ADD COLUMN image TEXT;
        -- Copy thumbnail values to image for existing rows
        UPDATE products SET image = thumbnail WHERE thumbnail IS NOT NULL;

        -- Create trigger to keep image and thumbnail in sync
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

        CREATE TRIGGER product_image_sync
        BEFORE UPDATE ON products
        FOR EACH ROW
        EXECUTE FUNCTION sync_product_image();
    END IF;
END $$;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================
-- Run these to verify tables were created successfully:

-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
-- AND table_name IN ('services', 'partners', 'social_links')
-- ORDER BY table_name;

-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'products' AND column_name IN ('image', 'thumbnail');

