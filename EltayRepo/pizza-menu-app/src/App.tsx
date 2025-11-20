import { useState, useEffect } from 'react'
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
  category: string // 'pizza' | 'drink' | 'dessert' | etc.
  image: string
  is_new?: boolean
}

interface Campaign {
  id: number
  name: string
  description: string
  price: number
  items: number[] // MenuItem id'leri
  image?: string
  created_at?: string
}

interface Category {
  id: number
  name: string
  label: string
  display_order: number
}

// Görsellerden oluşturuldu - dosya isimlerine göre
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

// Cache utilities
const CACHE_TTL = 5 * 60 * 1000 // 5 dakika
const MENU_CACHE_KEY = 'timtim_menu_cache'
const MENU_CACHE_TIME_KEY = 'timtim_menu_cache_time'
const CAMPAIGNS_CACHE_KEY = 'timtim_campaigns_cache'
const CAMPAIGNS_CACHE_TIME_KEY = 'timtim_campaigns_cache_time'
const CATEGORIES_CACHE_KEY = 'timtim_categories_cache'
const CATEGORIES_CACHE_TIME_KEY = 'timtim_categories_cache_time'

const getCachedData = <T,>(cacheKey: string, timeKey: string): T | null => {
  try {
    const cachedTime = localStorage.getItem(timeKey)
    const cachedData = localStorage.getItem(cacheKey)
    
    if (cachedTime && cachedData) {
      const now = Date.now()
      const cacheTime = parseInt(cachedTime, 10)
      
      // Cache hala geçerli mi?
      if (now - cacheTime < CACHE_TTL) {
        return JSON.parse(cachedData) as T
      } else {
        // Cache süresi dolmuş, temizle
        localStorage.removeItem(cacheKey)
        localStorage.removeItem(timeKey)
      }
    }
  } catch (error) {
    console.error('Cache read error:', error)
  }
  return null
}

const setCachedData = <T,>(cacheKey: string, timeKey: string, data: T): void => {
  try {
    localStorage.setItem(cacheKey, JSON.stringify(data))
    localStorage.setItem(timeKey, Date.now().toString())
  } catch (error) {
    console.error('Cache write error:', error)
  }
}

// Cache'i temizle (admin panelde değişiklik yapıldığında kullanılacak)
export const clearMenuCache = (): void => {
  localStorage.removeItem(MENU_CACHE_KEY)
  localStorage.removeItem(MENU_CACHE_TIME_KEY)
  localStorage.removeItem(CAMPAIGNS_CACHE_KEY)
  localStorage.removeItem(CAMPAIGNS_CACHE_TIME_KEY)
  localStorage.removeItem(CATEGORIES_CACHE_KEY)
  localStorage.removeItem(CATEGORIES_CACHE_TIME_KEY)
}

// Supabase utilities
const getMenuData = async (forceRefresh = false): Promise<MenuItem[]> => {
  // Cache'den kontrol et
  if (!forceRefresh) {
    const cached = getCachedData<MenuItem[]>(MENU_CACHE_KEY, MENU_CACHE_TIME_KEY)
    if (cached) {
      return cached
    }
  }

  try {
    const { data, error } = await supabase
      .from('timtim_pizza_menu')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching menu:', error)
      // Hata durumunda cache'den döndür veya default veriyi döndür
      const cached = getCachedData<MenuItem[]>(MENU_CACHE_KEY, MENU_CACHE_TIME_KEY)
      return cached || menuData
    }
    
    if (data && data.length > 0) {
      const menuItems = data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        prices: {
          small: item.price_small || 0,
          medium: item.price_medium || 0,
          large: item.price_large || 0
        },
        category: item.category || 'pizza',
        image: item.image || '',
        is_new: item.is_new || false
      }))
      
      // Cache'e kaydet
      setCachedData(MENU_CACHE_KEY, MENU_CACHE_TIME_KEY, menuItems)
      return menuItems
    }
    
    // Veri yoksa default veriyi döndür
    return menuData
  } catch (error) {
    console.error('Error:', error)
    // Hata durumunda cache'den döndür
    const cached = getCachedData<MenuItem[]>(MENU_CACHE_KEY, MENU_CACHE_TIME_KEY)
    return cached || menuData
  }
}

// Kampanyaları getir
const getCampaigns = async (forceRefresh = false): Promise<Campaign[]> => {
  // Cache'den kontrol et
  if (!forceRefresh) {
    const cached = getCachedData<Campaign[]>(CAMPAIGNS_CACHE_KEY, CAMPAIGNS_CACHE_TIME_KEY)
    if (cached) {
      return cached
    }
  }

  try {
    const { data, error } = await supabase
      .from('timtim_campaigns')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching campaigns:', error)
      // Hata durumunda cache'den döndür
      const cached = getCachedData<Campaign[]>(CAMPAIGNS_CACHE_KEY, CAMPAIGNS_CACHE_TIME_KEY)
      return cached || []
    }
    
    const campaigns = (data || []).map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      items: item.items || [],
      image: item.image || '',
      created_at: item.created_at
    }))
    
    // Cache'e kaydet
    setCachedData(CAMPAIGNS_CACHE_KEY, CAMPAIGNS_CACHE_TIME_KEY, campaigns)
    return campaigns
  } catch (error) {
    console.error('Error:', error)
    // Hata durumunda cache'den döndür
    const cached = getCachedData<Campaign[]>(CAMPAIGNS_CACHE_KEY, CAMPAIGNS_CACHE_TIME_KEY)
    return cached || []
  }
}

// Kategorileri getir
const getCategories = async (forceRefresh = false): Promise<Category[]> => {
  // Cache'den kontrol et
  if (!forceRefresh) {
    const cached = getCachedData<Category[]>(CATEGORIES_CACHE_KEY, CATEGORIES_CACHE_TIME_KEY)
    if (cached) {
      return cached
    }
  }

  try {
    const { data, error } = await supabase
      .from('timtim_categories')
      .select('*')
      .order('display_order', { ascending: true })
    
    if (error) {
      console.error('Error fetching categories:', error)
      // Hata durumunda cache'den döndür veya default kategorileri döndür
      const cached = getCachedData<Category[]>(CATEGORIES_CACHE_KEY, CATEGORIES_CACHE_TIME_KEY)
      return cached || [
        { id: 1, name: 'pizza', label: 'Pizza', display_order: 1 },
        { id: 2, name: 'drink', label: 'İçecek', display_order: 2 },
        { id: 3, name: 'dessert', label: 'Tatlı', display_order: 3 }
      ]
    }
    
    const categories = (data || []).map(item => ({
      id: item.id,
      name: item.name,
      label: item.label,
      display_order: item.display_order || 0
    }))
    
    // Cache'e kaydet
    setCachedData(CATEGORIES_CACHE_KEY, CATEGORIES_CACHE_TIME_KEY, categories)
    return categories
  } catch (error) {
    console.error('Error:', error)
    // Hata durumunda cache'den döndür
    const cached = getCachedData<Category[]>(CATEGORIES_CACHE_KEY, CATEGORIES_CACHE_TIME_KEY)
    return cached || [
      { id: 1, name: 'pizza', label: 'Pizza', display_order: 1 },
      { id: 2, name: 'drink', label: 'İçecek', display_order: 2 },
      { id: 3, name: 'dessert', label: 'Tatlı', display_order: 3 }
    ]
  }
}

function App() {
  // İlk render'da cache kontrolü yap
  const initialCachedMenu = getCachedData<MenuItem[]>(MENU_CACHE_KEY, MENU_CACHE_TIME_KEY)
  const initialCachedCampaigns = getCachedData<Campaign[]>(CAMPAIGNS_CACHE_KEY, CAMPAIGNS_CACHE_TIME_KEY)
  const initialCachedCategories = getCachedData<Category[]>(CATEGORIES_CACHE_KEY, CATEGORIES_CACHE_TIME_KEY)
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialCachedMenu || [])
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCachedCampaigns || [])
  const [categories, setCategories] = useState<Category[]>(initialCachedCategories || [])
  const [isLoading, setIsLoading] = useState(!initialCachedMenu || initialCachedMenu.length === 0)

  useEffect(() => {
    const loadMenu = async () => {
      // Cache yoksa loading göster (initial state'te cache yoksa)
      if (!initialCachedMenu || initialCachedMenu.length === 0) {
        setIsLoading(true)
      }
      
      // Arka planda güncel veriyi çek (cache olsa bile) - ASENKRON
      // Cache varsa kullanıcı zaten veriyi görüyor, bu sadece sessizce günceller
      Promise.all([
        getMenuData(false), // Cache kontrolü yap
        getCampaigns(false), // Cache kontrolü yap
        getCategories(false) // Cache kontrolü yap
      ]).then(([freshMenu, freshCampaigns, freshCategories]) => {
        // Arka planda güncelle
        setMenuItems(freshMenu)
        setCampaigns(freshCampaigns)
        setCategories(freshCategories)
        setIsLoading(false) // Her durumda loading'i kapat
      }).catch(() => {
        setIsLoading(false) // Hata olsa bile loading'i kapat
      })
    }
    loadMenu()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Sadece mount'ta çalış

  // Kategorileri dinamik olarak oluştur
  const categoryLabels: Record<string, string> = {
    all: 'Tümü',
    campaigns: 'Kampanyalı Ürünler',
    ...categories.reduce((acc, cat) => {
      acc[cat.name] = cat.label
      return acc
    }, {} as Record<string, string>)
  }
  
  const displayCategories = ['all', ...categories.map(cat => cat.name), 'campaigns']

  const filteredMenu = selectedCategory === 'all' 
    ? menuItems 
    : selectedCategory === 'campaigns'
    ? [] // Kampanyalar ayrı gösterilecek
    : menuItems.filter(item => item.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pb-20">
      {/* Header - Sticky */}
      <header className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-xl sticky top-0 z-20">
        <div className="flex items-center justify-center h-20 md:h-28 px-4">
          {/* Logo - Centered */}
          <img 
            src="/logo.jpg" 
            alt="Tim Tim Pizza Logo" 
            className="h-full w-auto max-w-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent && !parent.querySelector('.fallback-emoji')) {
                const emoji = document.createElement('div');
                emoji.className = 'fallback-emoji text-6xl md:text-8xl';
                emoji.textContent = '🍕';
                parent.appendChild(emoji);
              }
            }}
          />
          <div className="fallback-emoji text-6xl md:text-8xl" style={{display: 'none'}}>🍕</div>
        </div>
      </header>

      {/* Category Filters - Sticky */}
      <div className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-[80px] md:top-[112px] z-10 py-4 px-4 border-b border-gray-200">
        <div className="container mx-auto">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {displayCategories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full font-bold text-sm md:text-base whitespace-nowrap transition-all flex-shrink-0 shadow-md ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                }`}
              >
                {categoryLabels[category] || category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu List - Grid Layout */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 border-4 border-red-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-red-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-600 text-lg font-semibold">Menü yükleniyor...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenu.map(item => {
            // Görsel: base64 ise direkt kullan, değilse path'ten yükle
            const isBase64 = item.image.startsWith('data:image')
            const imageSrc = isBase64 
              ? item.image 
              : (() => {
                  const imageFileName = item.image.split('/').pop() || ''
                  return `/pizzas/${encodeURIComponent(imageFileName)}`
                })()
            
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                {/* Image - Full Width Top */}
                <div className="w-full h-56 md:h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden relative">
                  {item.image ? (
                    <img 
                      src={imageSrc} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const fallback = parent.querySelector('.fallback-emoji') as HTMLElement;
                          if (fallback) fallback.style.display = 'block';
                        }
                      }}
                    />
                  ) : null}
                  <span className="fallback-emoji text-7xl md:text-8xl" style={{display: item.image ? 'none' : 'block'}}>🍕</span>
                  
                  {/* Yeni Ürün Etiketi */}
                  {item.is_new && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1.5 rounded-full font-black text-xs md:text-sm shadow-lg animate-pulse">
                      ✨ YENİ
                    </div>
                  )}
                </div>
                
                {/* Content - Bottom */}
                <div className="p-5 md:p-6">
                  {/* Title */}
                  <div className="mb-4">
                    <h3 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 mb-3 leading-tight tracking-tight">
                      {item.name}
                    </h3>
                    {/* Description */}
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed line-clamp-3 font-medium">
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Price Section - Horizontal Layout */}
                  <div className="mt-6 pt-5 border-t-2 border-gray-200">
                    {item.category === 'pizza' ? (
                      <div className="flex items-center justify-between gap-2">
                        {/* Küçük - Mavi */}
                        <div className="flex-1 text-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border-2 border-blue-200 shadow-md hover:shadow-lg hover:scale-105 transition-all">
                          <div className="inline-flex items-center justify-center bg-blue-600 text-white rounded-full px-3 py-1 mb-2">
                            <span className="text-xs md:text-sm font-black uppercase tracking-wider">Küçük</span>
                          </div>
                          <div className="text-base md:text-lg font-extrabold text-blue-700 mb-2">24 cm</div>
                          <div className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-blue-700">
                            {item.prices.small}₺
                          </div>
                        </div>
                        <div className="w-px h-24 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                        {/* Orta - Turuncu */}
                        <div className="flex-1 text-center bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 border-2 border-orange-200 shadow-md hover:shadow-lg hover:scale-105 transition-all">
                          <div className="inline-flex items-center justify-center bg-orange-600 text-white rounded-full px-3 py-1 mb-2">
                            <span className="text-xs md:text-sm font-black uppercase tracking-wider">Orta</span>
                          </div>
                          <div className="text-base md:text-lg font-extrabold text-orange-700 mb-2">28 cm</div>
                          <div className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-600 to-orange-700">
                            {item.prices.medium}₺
                          </div>
                        </div>
                        <div className="w-px h-24 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                        {/* Büyük - Yeşil */}
                        <div className="flex-1 text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border-2 border-green-200 shadow-md hover:shadow-lg hover:scale-105 transition-all">
                          <div className="inline-flex items-center justify-center bg-green-600 text-white rounded-full px-3 py-1 mb-2">
                            <span className="text-xs md:text-sm font-black uppercase tracking-wider">Büyük</span>
                          </div>
                          <div className="text-base md:text-lg font-extrabold text-green-700 mb-2">32 cm</div>
                          <div className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-600 to-green-700">
                            {item.prices.large}₺
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
                        <span className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-600 to-red-700">
                          {item.prices.small || item.prices.medium || item.prices.large}₺
                        </span>
                        <span className="text-xs md:text-sm text-gray-700 bg-white px-4 py-2 rounded-full font-black uppercase tracking-wider shadow-sm border border-gray-200">
                          {categoryLabels[item.category] || item.category}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          
          {/* Kampanyalar */}
          {selectedCategory === 'campaigns' && campaigns.map(campaign => {
            const campaignItems = menuItems.filter(item => campaign.items.includes(item.id))
            return (
              <div
                key={campaign.id}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-purple-200"
              >
                {/* Image */}
                <div className="w-full h-56 md:h-64 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center overflow-hidden relative">
                  {campaign.image ? (
                    <img 
                      src={campaign.image} 
                      alt={campaign.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="grid grid-cols-2 gap-2 p-4 w-full h-full">
                      {campaignItems.slice(0, 4).map((item, idx) => (
                        <div key={idx} className="bg-white rounded-lg overflow-hidden">
                          {item.image && (
                            <img 
                              src={item.image.startsWith('data:image') ? item.image : `/pizzas/${item.image.split('/').pop()}`} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1.5 rounded-full font-black text-xs md:text-sm shadow-lg">
                    🎁 KAMPANYA
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-5 md:p-6">
                  <h3 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-900 to-pink-900 mb-3">
                    {campaign.name}
                  </h3>
                  <p className="text-sm md:text-base text-gray-700 mb-4 line-clamp-2">
                    {campaign.description}
                  </p>
                  
                  {/* İçerik Listesi */}
                  <div className="mb-4">
                    <p className="text-xs font-bold text-gray-600 mb-2">İçerik:</p>
                    <div className="flex flex-wrap gap-2">
                      {campaignItems.map(item => (
                        <span key={item.id} className="bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-700 border border-gray-200">
                          {item.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Fiyat */}
                  <div className="mt-6 pt-5 border-t-2 border-purple-200">
                    <div className="flex items-center justify-between bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-4 shadow-lg">
                      <div>
                        <p className="text-xs font-bold opacity-90">Kampanya Fiyatı</p>
                        <p className="text-3xl md:text-4xl font-black">{campaign.price}₺</p>
                      </div>
                      <div className="text-4xl">🎁</div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          </div>
        )}

        {!isLoading && filteredMenu.length === 0 && selectedCategory !== 'campaigns' && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍕</div>
            <p className="text-gray-500 text-lg md:text-xl font-semibold">Bu kategoride ürün bulunamadı.</p>
          </div>
        )}
        
        {!isLoading && selectedCategory === 'campaigns' && campaigns.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎁</div>
            <p className="text-gray-500 text-lg md:text-xl font-semibold">Henüz kampanya bulunmamaktadır.</p>
          </div>
        )}
      </div>

    </div>
  )
}

export default App
