-- Create navbar_settings table
CREATE TABLE IF NOT EXISTS navbar_settings (
  id TEXT PRIMARY KEY DEFAULT 'navbar',
  settings JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO navbar_settings (id, settings, updated_at)
VALUES (
  'navbar',
  '{
    "items": [
      {"id": "1", "label": "Trang chủ", "href": "/", "type": "link", "enabled": true, "order": 0, "showInMobile": true, "showInDesktop": true},
      {"id": "2", "label": "Sản phẩm", "href": "/san-pham", "type": "dropdown", "enabled": true, "order": 1, "showInMobile": true, "showInDesktop": true, "children": []},
      {"id": "3", "label": "Tin tức", "href": "/tin-tuc", "type": "link", "enabled": true, "order": 2, "showInMobile": true, "showInDesktop": true},
      {"id": "4", "label": "Thư viện hình ảnh", "href": "/thu-vien-hinh-anh", "type": "link", "enabled": true, "order": 3, "showInMobile": true, "showInDesktop": true}
    ],
    "showSearch": true,
    "showWishlist": true,
    "showCatalogButton": true,
    "showContactButton": true,
    "catalogButtonText": "Xem catalog",
    "catalogButtonUrl": "/page-download-catalog",
    "contactButtonText": "Liên hệ",
    "contactButtonUrl": "/lien-he"
  }'::jsonb,
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE navbar_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read" ON navbar_settings
  FOR SELECT USING (true);

-- Allow authenticated write access
CREATE POLICY "Allow authenticated write" ON navbar_settings
  FOR ALL USING (true);
