// Mevcut menüyü Supabase'e aktarma scripti
// Bu dosyayı bir kere çalıştırmak için: Browser console'da import edip çalıştır

import { supabase } from './supabaseClient'

interface PizzaSize {
  small: number
  medium: number
  large: number
}

interface MenuItem {
  id: number
  name: string
  description: string
  prices: PizzaSize
  category: 'pizza'
  image: string
}

const menuData: MenuItem[] = [
  {
    id: 1,
    name: 'Margarita Pizza',
    description: 'İnce hamur, mozzarella, domates sos, cherry domates',
    prices: { small: 250, medium: 300, large: 350 },
    category: 'pizza',
    image: '/pizzas/Margarita Pizza.jpg'
  },
  {
    id: 2,
    name: 'Pepperoni Pizza',
    description: 'İnce hamur, mozzarella, sucuk, domates sos, pesto sos',
    prices: { small: 290, medium: 350, large: 410 },
    category: 'pizza',
    image: '/pizzas/Pepperoni Pizza.jpg'
  },
  {
    id: 3,
    name: 'Timtim Karışık Pizza',
    description: 'İnce hamur, mozzarella, domates sos, sucuk, salam, kırmızı biber, yeşil biber, kırmızı soğan, mantar, yeşil zeytin, siyah zeytin, mısır',
    prices: { small: 330, medium: 390, large: 450 },
    category: 'pizza',
    image: '/pizzas/Timtim Karışık Pizza.jpg'
  },
  {
    id: 4,
    name: 'Akdeniz Sebzeli Pizza',
    description: 'İnce hamur, mozzarella, domates sos, patlıcan, kabak, kırmızı soğan, kurutulmuş domates',
    prices: { small: 250, medium: 300, large: 350 },
    category: 'pizza',
    image: '/pizzas/Akdeniz Sebzeli Pizza.jpg'
  },
  {
    id: 5,
    name: 'Anadolu Kıymalı Pizza',
    description: 'İnce hamur, mozzarella, domates sos, patlıcan, kırmızı soğan, kıyma',
    prices: { small: 375, medium: 435, large: 495 },
    category: 'pizza',
    image: '/pizzas/Anadolu Kıymalı Pizza.jpg'
  },
  {
    id: 6,
    name: 'Anne Eli Kıymalı Pizza',
    description: 'İnce hamur, mozzarella, domates sos, pesto sos, kıyma, yeşil biber, kırmızı biber',
    prices: { small: 375, medium: 435, large: 495 },
    category: 'pizza',
    image: '/pizzas/Anne Eli Kıymalı Pizza.jpg'
  },
  {
    id: 7,
    name: 'BBQ Tavuk Pizza',
    description: 'İnce hamur, mozzarella, tavuk, domates sos, bbq sos, mantar, kırmızı soğan',
    prices: { small: 300, medium: 360, large: 420 },
    category: 'pizza',
    image: '/pizzas/BBQ Tavuk Pizza.jpg'
  },
  {
    id: 8,
    name: 'Et Şöleni Pizza',
    description: 'İnce hamur, mozzarella, domates sos, pesto sos, sucuk, pastırma, siyah zeytin, kırmızı soğan',
    prices: { small: 370, medium: 430, large: 490 },
    category: 'pizza',
    image: '/pizzas/Et Şöleni Pizza.jpg'
  },
  {
    id: 9,
    name: 'Hawaii Pizza',
    description: 'İnce hamur, mozzarella, domates sos, ananas, tavuk göğsü',
    prices: { small: 300, medium: 360, large: 420 },
    category: 'pizza',
    image: '/pizzas/Hawaii Pizza.jpg'
  },
  {
    id: 10,
    name: 'Jambonlu Pizza',
    description: 'İnce hamur, mozzarella, jambon, domates sos, mantar, siyah zeytin',
    prices: { small: 300, medium: 350, large: 400 },
    category: 'pizza',
    image: '/pizzas/Jambonlu Pizza.jpg'
  },
  {
    id: 11,
    name: 'Kremalı Sebzeli Pizza',
    description: 'İnce hamur, mozzarella, kremalı sos, yeşil zeytin, kırmızı soğan, mısır, kurutulmuş domates',
    prices: { small: 275, medium: 330, large: 375 },
    category: 'pizza',
    image: '/pizzas/Kremalı Sebzeli Pizza.jpg'
  },
  {
    id: 12,
    name: 'Pastırmalı Pizza',
    description: 'İnce hamur, mozzarella, domates sos, pesto sos, pastırma, kırmızı biber, kırmızı soğan, siyah zeytin',
    prices: { small: 370, medium: 430, large: 490 },
    category: 'pizza',
    image: '/pizzas/Pastırmalı Pizza.jpg'
  },
  {
    id: 13,
    name: 'Timtim Dört Peynirli Pizza',
    description: 'İnce hamur, mozzarella, kremalı sos, kaşar, parmesan, cheddar',
    prices: { small: 300, medium: 350, large: 400 },
    category: 'pizza',
    image: '/pizzas/Timtim Dört Peynirli Pizza.jpg'
  },
  {
    id: 14,
    name: 'Timtim Karışık Tavuklu Pizza',
    description: 'İnce hamur, mozzarella, kremalı sos, tavuk göğsü, yeşil zeytin, siyah zeytin, mısır, kırmızı biber, kırmızı soğan, mantar',
    prices: { small: 320, medium: 380, large: 440 },
    category: 'pizza',
    image: '/pizzas/Timtim Karışık Tavuklu Pizza.jpg'
  },
  {
    id: 15,
    name: 'Timtim Sezar Pizza',
    description: 'İnce hamur, mozzarella, parmesan, sezar sos, sarımsak, tavuk, cherry domates, göbek yeşillik, bıldırcın yumurta',
    prices: { small: 300, medium: 360, large: 420 },
    category: 'pizza',
    image: '/pizzas/Timtim Sezar Pizza.jpg'
  },
  {
    id: 16,
    name: 'Timtim Somonlu Pizza',
    description: 'İnce hamur, mozzarella, somon balığı, siyah zeytin, cherry domates, kremalı sos',
    prices: { small: 350, medium: 410, large: 470 },
    category: 'pizza',
    image: '/pizzas/Timtim Somonlu Pizza.jpg'
  }
]

// Resmi base64'e çevir
async function imageToBase64(imagePath: string): Promise<string> {
  try {
    const response = await fetch(imagePath)
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.warn(`Resim yüklenemedi: ${imagePath}, path olarak kaydediliyor`)
    return imagePath // Hata durumunda path olarak döndür
  }
}

export async function migrateMenuToSupabase(convertImagesToBase64: boolean = true) {
  console.log('🚀 Menü aktarımı başlıyor...')
  if (convertImagesToBase64) {
    console.log('📸 Resimler base64 formatına çevriliyor...')
  }
  
  let successCount = 0
  let errorCount = 0

  for (const item of menuData) {
    try {
      // Resmi base64'e çevir veya path olarak kullan
      let imageData = item.image
      if (convertImagesToBase64 && item.image.startsWith('/')) {
        imageData = await imageToBase64(item.image)
        // Kısa bir delay ekle (rate limiting için)
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      const { error } = await supabase
        .from('timtim_pizza_menu')
        .upsert({
          id: item.id,
          name: item.name,
          description: item.description,
          price_small: item.prices.small,
          price_medium: item.prices.medium,
          price_large: item.prices.large,
          image: imageData,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })

      if (error) {
        console.error(`❌ ${item.name} kaydedilemedi:`, error)
        errorCount++
      } else {
        console.log(`✅ ${item.name} kaydedildi`)
        successCount++
      }
    } catch (error) {
      console.error(`❌ ${item.name} hatası:`, error)
      errorCount++
    }
  }

  console.log(`\n📊 Sonuç: ${successCount} başarılı, ${errorCount} hata`)
  return { successCount, errorCount }
}

// Browser console'dan çalıştırmak için
if (typeof window !== 'undefined') {
  (window as any).migrateMenu = migrateMenuToSupabase
}

