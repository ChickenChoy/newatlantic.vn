-- Add 'image' column to products table if not exists
-- This aligns the Supabase schema with the frontend expectations
-- The 'image' column stores the main product image URL

ALTER TABLE products ADD COLUMN IF NOT EXISTS image TEXT;

-- Update existing products to copy thumbnail to image if image is null
UPDATE products SET image = thumbnail WHERE image IS NULL AND thumbnail IS NOT NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_products_image ON products(image);
