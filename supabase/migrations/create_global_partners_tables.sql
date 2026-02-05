-- Migration: Create Global Partners Tables
-- Run this SQL in your Supabase SQL Editor

-- Table for partner regions (geographic areas like North America, Europe, etc.)
CREATE TABLE IF NOT EXISTS global_partner_regions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_vi TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for individual partners within each region
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_global_partners_region_id ON global_partners(region_id);
CREATE INDEX IF NOT EXISTS idx_global_partner_regions_order ON global_partner_regions(order_index);
CREATE INDEX IF NOT EXISTS idx_global_partners_order ON global_partners(order_index);

-- Enable Row Level Security (RLS)
ALTER TABLE global_partner_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_partners ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on global_partner_regions"
  ON global_partner_regions FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on global_partners"
  ON global_partners FOR SELECT
  USING (true);

-- Create policies for authenticated insert/update/delete
CREATE POLICY "Allow authenticated insert on global_partner_regions"
  ON global_partner_regions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on global_partner_regions"
  ON global_partner_regions FOR UPDATE
  USING (true);

CREATE POLICY "Allow authenticated delete on global_partner_regions"
  ON global_partner_regions FOR DELETE
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

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic updated_at
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
