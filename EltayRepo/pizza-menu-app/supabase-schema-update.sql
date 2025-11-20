-- 1. timtim_pizza_menu tablosuna category ve is_new kolonları ekle
ALTER TABLE timtim_pizza_menu 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'pizza',
ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT false;

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

