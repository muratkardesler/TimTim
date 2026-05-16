-- ============================================
-- TimTim Pizza - Supabase Init Schema
-- Yeni bir Supabase projesinde 1 kez çalıştır.
-- (SQL Editor → New query → Aşağıdaki içeriği yapıştır → Run)
-- ============================================

-- =====================================================
-- 1) MENÜ TABLOSU (timtim_pizza_menu)
-- =====================================================
CREATE TABLE IF NOT EXISTS timtim_pizza_menu (
  id              BIGINT PRIMARY KEY,
  name            TEXT NOT NULL,
  description     TEXT,
  price_small     NUMERIC DEFAULT 0,
  price_medium    NUMERIC DEFAULT 0,
  price_large     NUMERIC DEFAULT 0,
  image           TEXT,
  category        TEXT DEFAULT 'pizza',
  is_new          BOOLEAN DEFAULT FALSE,
  display_order   BIGINT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_menu_category      ON timtim_pizza_menu(category);
CREATE INDEX IF NOT EXISTS idx_menu_display_order ON timtim_pizza_menu(display_order);
CREATE INDEX IF NOT EXISTS idx_menu_created_at    ON timtim_pizza_menu(created_at DESC);

-- =====================================================
-- 2) KAMPANYALAR TABLOSU (timtim_campaigns)
-- =====================================================
CREATE TABLE IF NOT EXISTS timtim_campaigns (
  id           BIGINT PRIMARY KEY,
  name         TEXT NOT NULL,
  description  TEXT NOT NULL,
  price        NUMERIC NOT NULL,
  items        BIGINT[] NOT NULL,
  image        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON timtim_campaigns(created_at DESC);

-- =====================================================
-- 3) KATEGORİLER TABLOSU (timtim_categories)
-- =====================================================
CREATE TABLE IF NOT EXISTS timtim_categories (
  id             BIGSERIAL PRIMARY KEY,
  name           TEXT NOT NULL UNIQUE,
  label          TEXT NOT NULL,
  display_order  INTEGER DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_display_order ON timtim_categories(display_order);

-- =====================================================
-- 4) VARSAYILAN KATEGORİLER
-- =====================================================
INSERT INTO timtim_categories (name, label, display_order) VALUES
  ('pizza',   'Pizza',   1),
  ('drink',   'İçecek',  2),
  ('dessert', 'Tatlı',   3)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 5) MEVCUT 16 PİZZA (TimTim menüsü)
-- =====================================================
INSERT INTO timtim_pizza_menu
  (id, name, description, price_small, price_medium, price_large, category, image, display_order)
VALUES
  (1,  'Margarita Pizza',                'İnce hamur, mozzarella, domates sos, cherry domates',                                                                                          250, 300, 350, 'pizza', '/pizzas/Margarita Pizza.jpg',                1),
  (2,  'Pepperoni Pizza',                'İnce hamur, mozzarella, sucuk, domates sos, pesto sos',                                                                                        290, 350, 410, 'pizza', '/pizzas/Pepperoni Pizza.jpg',                2),
  (3,  'Timtim Karışık Pizza',           'İnce hamur, mozzarella, domates sos, sucuk, salam, kırmızı biber, yeşil biber, kırmızı soğan, mantar, yeşil zeytin, siyah zeytin, mısır',     330, 390, 450, 'pizza', '/pizzas/Timtim Karışık Pizza.jpg',           3),
  (4,  'Akdeniz Sebzeli Pizza',          'İnce hamur, mozzarella, domates sos, patlıcan, kabak, kırmızı soğan, kurutulmuş domates',                                                     250, 300, 350, 'pizza', '/pizzas/Akdeniz Sebzeli Pizza.jpg',          4),
  (5,  'Anadolu Kıymalı Pizza',          'İnce hamur, mozzarella, domates sos, patlıcan, kırmızı soğan, kıyma',                                                                          375, 435, 495, 'pizza', '/pizzas/Anadolu Kıymalı Pizza.jpg',          5),
  (6,  'Anne Eli Kıymalı Pizza',         'İnce hamur, mozzarella, domates sos, pesto sos, kıyma, yeşil biber, kırmızı biber',                                                            375, 435, 495, 'pizza', '/pizzas/Anne Eli Kıymalı Pizza.jpg',         6),
  (7,  'BBQ Tavuk Pizza',                'İnce hamur, mozzarella, tavuk, domates sos, bbq sos, mantar, kırmızı soğan',                                                                   300, 360, 420, 'pizza', '/pizzas/BBQ Tavuk Pizza.jpg',                7),
  (8,  'Et Şöleni Pizza',                'İnce hamur, mozzarella, domates sos, pesto sos, sucuk, pastırma, siyah zeytin, kırmızı soğan',                                                 370, 430, 490, 'pizza', '/pizzas/Et Şöleni Pizza.jpg',                8),
  (9,  'Hawaii Pizza',                   'İnce hamur, mozzarella, domates sos, ananas, tavuk göğsü',                                                                                     300, 360, 420, 'pizza', '/pizzas/Hawaii Pizza.jpg',                   9),
  (10, 'Jambonlu Pizza',                 'İnce hamur, mozzarella, jambon, domates sos, mantar, siyah zeytin',                                                                            300, 350, 400, 'pizza', '/pizzas/Jambonlu Pizza.jpg',                10),
  (11, 'Kremalı Sebzeli Pizza',          'İnce hamur, mozzarella, kremalı sos, yeşil zeytin, kırmızı soğan, mısır, kurutulmuş domates',                                                  275, 330, 375, 'pizza', '/pizzas/Kremalı Sebzeli Pizza.jpg',         11),
  (12, 'Pastırmalı Pizza',               'İnce hamur, mozzarella, domates sos, pesto sos, pastırma, kırmızı biber, kırmızı soğan, siyah zeytin',                                         370, 430, 490, 'pizza', '/pizzas/Pastırmalı Pizza.jpg',              12),
  (13, 'Timtim Dört Peynirli Pizza',     'İnce hamur, mozzarella, kremalı sos, kaşar, parmesan, cheddar',                                                                                300, 350, 400, 'pizza', '/pizzas/Timtim Dört Peynirli Pizza.jpg',    13),
  (14, 'Timtim Karışık Tavuklu Pizza',   'İnce hamur, mozzarella, kremalı sos, tavuk göğsü, yeşil zeytin, siyah zeytin, mısır, kırmızı biber, kırmızı soğan, mantar',                    320, 380, 440, 'pizza', '/pizzas/Timtim Karışık Tavuklu Pizza.jpg',  14),
  (15, 'Timtim Sezar Pizza',             'İnce hamur, mozzarella, parmesan, sezar sos, sarımsak, tavuk, cherry domates, göbek yeşillik, bıldırcın yumurta',                              300, 360, 420, 'pizza', '/pizzas/Timtim Sezar Pizza.jpg',            15),
  (16, 'Timtim Somonlu Pizza',           'İnce hamur, mozzarella, somon balığı, siyah zeytin, cherry domates, kremalı sos',                                                              350, 410, 470, 'pizza', '/pizzas/Timtim Somonlu Pizza.jpg',          16)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- BİTTİ
-- =====================================================
