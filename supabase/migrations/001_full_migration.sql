-- ========================================
-- NEW ATLANTIC FULL DATABASE MIGRATION
-- JSON -> Supabase Migration Script
-- Version 2.0 - Complete Migration
-- ========================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- 1. PRODUCTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT,
    category_name TEXT,
    description TEXT,
    short_description TEXT,
    price DECIMAL(15, 2),
    original_price DECIMAL(15, 2),
    discount_percentage INTEGER DEFAULT 0,
    images TEXT[] DEFAULT '{}',
    thumbnail TEXT,
    specifications JSONB DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    brand TEXT,
    sku TEXT,
    in_stock BOOLEAN DEFAULT true,
    stock_quantity INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    is_bestseller BOOLEAN DEFAULT false,
    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT,
    views INTEGER DEFAULT 0,
    sales_count INTEGER DEFAULT 0,
    rating DECIMAL(2, 1) DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for products
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_enabled ON products(enabled);

-- ========================================
-- 2. CATEGORIES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image TEXT,
    parent_id TEXT,
    order_index INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT true,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);

-- ========================================
-- 3. POSTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    featured_image TEXT,
    thumbnail TEXT,
    category TEXT,
    category_name TEXT,
    tags TEXT[] DEFAULT '{}',
    author TEXT,
    author_name TEXT,
    status TEXT DEFAULT 'draft', -- draft, published, archived
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT,
    is_featured BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published_at);

-- ========================================
-- 4. POST_CATEGORIES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS post_categories (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_post_categories_slug ON post_categories(slug);

-- ========================================
-- 5. MEDIA TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS media (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    filename TEXT NOT NULL,
    original_name TEXT,
    folder TEXT DEFAULT 'uploads',
    mime_type TEXT,
    size INTEGER,
    dimensions JSONB, -- {width, height}
    variants JSONB DEFAULT '{}', -- thumbnail, medium, large URLs
    alt_text TEXT,
    caption TEXT,
    tags TEXT[] DEFAULT '{}',
    usage JSONB DEFAULT '{}',
    storage_url TEXT, -- Supabase Storage URL
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_folder ON media(folder);
CREATE INDEX IF NOT EXISTS idx_media_mime_type ON media(mime_type);

-- ========================================
-- 6. GALLERY_IMAGES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS gallery_images (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    src TEXT NOT NULL,
    alt TEXT,
    title TEXT,
    description TEXT,
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON gallery_images(category);

-- ========================================
-- 7. SITE_SETTINGS TABLE (Key-Value Store)
-- ========================================
CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 8. SEO_SETTINGS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS seo_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    site_name TEXT,
    site_description TEXT,
    site_keywords TEXT,
    default_og_image TEXT,
    google_verification TEXT,
    bing_verification TEXT,
    yandex_verification TEXT,
    facebook_app_id TEXT,
    twitter_handle TEXT,
    page_settings JSONB DEFAULT '{}', -- Per-page SEO settings
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 9. HERO_SLIDES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS hero_slides (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    title TEXT,
    subtitle TEXT,
    label TEXT,
    description TEXT,
    image TEXT,
    video TEXT,
    link TEXT,
    link_text TEXT,
    order_index INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 10. HOMEPAGE_STATS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS homepage_stats (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    suffix TEXT,
    icon TEXT,
    order_index INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 11. HOMEPAGE_SERVICES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS homepage_services (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    link TEXT,
    order_index INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 12. PARTNER_LOGOS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS partner_logos (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    name TEXT NOT NULL,
    logo TEXT,
    url TEXT,
    order_index INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 13. TESTIMONIALS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS testimonials (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    name TEXT NOT NULL,
    position TEXT,
    company TEXT,
    text TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    image TEXT,
    order_index INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 14. FAQS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS faqs (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT,
    order_index INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 15. CERTIFICATIONS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS certifications (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    image TEXT,
    order_index INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 16. CATALOGS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS catalogs (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    title TEXT NOT NULL,
    description TEXT,
    brand TEXT,
    download_url TEXT NOT NULL,
    thumbnail TEXT,
    file_size TEXT,
    order_index INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_catalogs_brand ON catalogs(brand);

-- ========================================
-- 17. OFFICE_LOCATIONS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS office_locations (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    name TEXT NOT NULL,
    type TEXT DEFAULT 'branch', -- headquarters, branch, warehouse
    region TEXT,
    address TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    google_maps_url TEXT,
    directions_url TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    order_index INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 18. FOOTER_LINKS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS footer_links (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    label TEXT NOT NULL,
    href TEXT NOT NULL,
    section TEXT NOT NULL, -- quick, service, policy
    is_external BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_footer_links_section ON footer_links(section);

-- ========================================
-- 19. PAGE_VISIBILITY TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS page_visibility (
    id TEXT PRIMARY KEY,
    path TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    visible BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 20. HOLIDAY_EFFECTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS holiday_effects (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    enabled BOOLEAN DEFAULT false,
    start_date TEXT, -- MM-DD format
    end_date TEXT,
    effect_types TEXT[] DEFAULT '{}', -- banner, fireworks, snow, flowers, flags
    primary_color TEXT,
    secondary_color TEXT,
    custom_config JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 21. ACTIVITY_LOGS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS activity_logs (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    action TEXT NOT NULL, -- create, update, delete, login, etc.
    entity TEXT NOT NULL, -- product, post, user, etc.
    entity_id TEXT,
    entity_name TEXT,
    user_email TEXT,
    user_id TEXT,
    details TEXT,
    ip_address TEXT,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_email);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);

-- ========================================
-- 22. ADMIN_SETTINGS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS admin_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- Enable Row Level Security (RLS)
-- ========================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE office_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_visibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE holiday_effects ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- ========================================
-- RLS Policies - Public Read Access
-- ========================================
CREATE POLICY "Public read access for products" ON products FOR SELECT USING (enabled = true);
CREATE POLICY "Public read access for categories" ON categories FOR SELECT USING (enabled = true);
CREATE POLICY "Public read access for posts" ON posts FOR SELECT USING (status = 'published');
CREATE POLICY "Public read access for post_categories" ON post_categories FOR SELECT USING (enabled = true);
CREATE POLICY "Public read access for media" ON media FOR SELECT USING (true);
CREATE POLICY "Public read access for gallery_images" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Public read access for hero_slides" ON hero_slides FOR SELECT USING (enabled = true);
CREATE POLICY "Public read access for homepage_stats" ON homepage_stats FOR SELECT USING (enabled = true);
CREATE POLICY "Public read access for homepage_services" ON homepage_services FOR SELECT USING (enabled = true);
CREATE POLICY "Public read access for partner_logos" ON partner_logos FOR SELECT USING (enabled = true);
CREATE POLICY "Public read access for testimonials" ON testimonials FOR SELECT USING (enabled = true);
CREATE POLICY "Public read access for faqs" ON faqs FOR SELECT USING (enabled = true);
CREATE POLICY "Public read access for certifications" ON certifications FOR SELECT USING (enabled = true);
CREATE POLICY "Public read access for catalogs" ON catalogs FOR SELECT USING (enabled = true);
CREATE POLICY "Public read access for office_locations" ON office_locations FOR SELECT USING (enabled = true);
CREATE POLICY "Public read access for footer_links" ON footer_links FOR SELECT USING (enabled = true);
CREATE POLICY "Public read access for page_visibility" ON page_visibility FOR SELECT USING (true);
CREATE POLICY "Public read access for holiday_effects" ON holiday_effects FOR SELECT USING (enabled = true);
CREATE POLICY "Public read access for site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read access for seo_settings" ON seo_settings FOR SELECT USING (true);

-- ========================================
-- RLS Policies - Service Role Full Access
-- ========================================
CREATE POLICY "Service role full access for products" ON products FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access for categories" ON categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access for posts" ON posts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access for post_categories" ON post_categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access for media" ON media FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access for gallery_images" ON gallery_images FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access for site_settings" ON site_settings FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access for seo_settings" ON seo_settings FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access for hero_slides" ON hero_slides FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access for homepage_stats" ON homepage_stats FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access for homepage_services" ON homepage_services FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access for partner_logos" ON partner_logos FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access for testimonials" ON testimonials FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access for faqs" ON faqs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access for certifications" ON certifications FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access for catalogs" ON catalogs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access for office_locations" ON office_locations FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access for footer_links" ON footer_links FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access for page_visibility" ON page_visibility FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access for holiday_effects" ON holiday_effects FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access for activity_logs" ON activity_logs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access for admin_settings" ON admin_settings FOR ALL USING (auth.role() = 'service_role');

-- ========================================
-- Updated_at Trigger Function
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_post_categories_updated_at BEFORE UPDATE ON post_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gallery_images_updated_at BEFORE UPDATE ON gallery_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seo_settings_updated_at BEFORE UPDATE ON seo_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hero_slides_updated_at BEFORE UPDATE ON hero_slides FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_page_visibility_updated_at BEFORE UPDATE ON page_visibility FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_holiday_effects_updated_at BEFORE UPDATE ON holiday_effects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_settings_updated_at BEFORE UPDATE ON admin_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- DONE! Run this in Supabase SQL Editor
-- ========================================
