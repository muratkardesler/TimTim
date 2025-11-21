-- 1. timtim_pizza_menu tablosuna category, is_new ve display_order kolonları ekle
ALTER TABLE timtim_pizza_menu 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'pizza',
ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS display_order BIGINT DEFAULT 0;

-- Mevcut kayıtlar için display_order güncelle (sıralı numara ver)
UPDATE timtim_pizza_menu t1
SET display_order = t2.row_num
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC, id DESC) as row_num
  FROM timtim_pizza_menu
  WHERE display_order = 0 OR display_order IS NULL
) t2
WHERE t1.id = t2.id;

-- 2. timtim_campaigns tablosu oluştur
CREATE TABLE IF NOT EXISTS timtim_campaigns (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  items BIGINT[] NOT NULL, -- MenuItem id'lerinin array'i
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index ekle
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON timtim_campaigns(created_at DESC);

-- 3. timtim_categories tablosu oluştur
CREATE TABLE IF NOT EXISTS timtim_categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL, -- Görünen isim (Türkçe)
  display_order INTEGER DEFAULT 0, -- Sıralama için
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Varsayılan kategorileri ekle
INSERT INTO timtim_categories (name, label, display_order) 
VALUES 
  ('pizza', 'Pizza', 1),
  ('drink', 'İçecek', 2),
  ('dessert', 'Tatlı', 3)
ON CONFLICT (name) DO NOTHING;

-- Index ekle
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON timtim_categories(display_order);

