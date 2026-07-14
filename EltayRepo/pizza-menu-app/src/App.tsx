import { useState, useEffect, useLayoutEffect, useRef } from 'react'
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
  category: string
  image: string
  is_new?: boolean
  display_order?: number
}

interface Campaign {
  id: number
  name: string
  description: string
  price: number
  items: number[]
  image?: string
  created_at?: string
}

interface Category {
  id: number
  name: string
  label: string
  display_order: number
}

const menuData: MenuItem[] = [
  { id: 1, name: 'Margarita Pizza', description: 'İnce hamur, mozzarella, domates sos, cherry domates', prices: { small: 250, medium: 300, large: 350 }, category: 'pizza', image: '/pizzas/Margarita Pizza.jpg' },
  { id: 2, name: 'Pepperoni Pizza', description: 'İnce hamur, mozzarella, sucuk, domates sos, pesto sos', prices: { small: 290, medium: 350, large: 410 }, category: 'pizza', image: '/pizzas/Pepperoni Pizza.jpg' },
  { id: 3, name: 'Timtim Karışık Pizza', description: 'İnce hamur, mozzarella, domates sos, sucuk, salam, kırmızı biber, yeşil biber, kırmızı soğan, mantar, yeşil zeytin, siyah zeytin, mısır', prices: { small: 330, medium: 390, large: 450 }, category: 'pizza', image: '/pizzas/Timtim Karışık Pizza.jpg' },
  { id: 4, name: 'Akdeniz Sebzeli Pizza', description: 'İnce hamur, mozzarella, domates sos, patlıcan, kabak, kırmızı soğan, kurutulmuş domates', prices: { small: 250, medium: 300, large: 350 }, category: 'pizza', image: '/pizzas/Akdeniz Sebzeli Pizza.jpg' },
  { id: 5, name: 'Anadolu Kıymalı Pizza', description: 'İnce hamur, mozzarella, domates sos, patlıcan, kırmızı soğan, kıyma', prices: { small: 375, medium: 435, large: 495 }, category: 'pizza', image: '/pizzas/Anadolu Kıymalı Pizza.jpg' },
  { id: 6, name: 'Anne Eli Kıymalı Pizza', description: 'İnce hamur, mozzarella, domates sos, pesto sos, kıyma, yeşil biber, kırmızı biber', prices: { small: 375, medium: 435, large: 495 }, category: 'pizza', image: '/pizzas/Anne Eli Kıymalı Pizza.jpg' },
  { id: 7, name: 'BBQ Tavuk Pizza', description: 'İnce hamur, mozzarella, tavuk, domates sos, bbq sos, mantar, kırmızı soğan', prices: { small: 300, medium: 360, large: 420 }, category: 'pizza', image: '/pizzas/BBQ Tavuk Pizza.jpg' },
  { id: 8, name: 'Et Şöleni Pizza', description: 'İnce hamur, mozzarella, domates sos, pesto sos, sucuk, pastırma, siyah zeytin, kırmızı soğan', prices: { small: 370, medium: 430, large: 490 }, category: 'pizza', image: '/pizzas/Et Şöleni Pizza.jpg' },
  { id: 9, name: 'Hawaii Pizza', description: 'İnce hamur, mozzarella, domates sos, ananas, tavuk göğsü', prices: { small: 300, medium: 360, large: 420 }, category: 'pizza', image: '/pizzas/Hawaii Pizza.jpg' },
  { id: 10, name: 'Jambonlu Pizza', description: 'İnce hamur, mozzarella, jambon, domates sos, mantar, siyah zeytin', prices: { small: 300, medium: 350, large: 400 }, category: 'pizza', image: '/pizzas/Jambonlu Pizza.jpg' },
  { id: 11, name: 'Kremalı Sebzeli Pizza', description: 'İnce hamur, mozzarella, kremalı sos, yeşil zeytin, kırmızı soğan, mısır, kurutulmuş domates', prices: { small: 275, medium: 330, large: 375 }, category: 'pizza', image: '/pizzas/Kremalı Sebzeli Pizza.jpg' },
  { id: 12, name: 'Pastırmalı Pizza', description: 'İnce hamur, mozzarella, domates sos, pesto sos, pastırma, kırmızı biber, kırmızı soğan, siyah zeytin', prices: { small: 370, medium: 430, large: 490 }, category: 'pizza', image: '/pizzas/Pastırmalı Pizza.jpg' },
  { id: 13, name: 'Timtim Dört Peynirli Pizza', description: 'İnce hamur, mozzarella, kremalı sos, kaşar, parmesan, cheddar', prices: { small: 300, medium: 350, large: 400 }, category: 'pizza', image: '/pizzas/Timtim Dört Peynirli Pizza.jpg' },
  { id: 14, name: 'Timtim Karışık Tavuklu Pizza', description: 'İnce hamur, mozzarella, kremalı sos, tavuk göğsü, yeşil zeytin, siyah zeytin, mısır, kırmızı biber, kırmızı soğan, mantar', prices: { small: 320, medium: 380, large: 440 }, category: 'pizza', image: '/pizzas/Timtim Karışık Tavuklu Pizza.jpg' },
  { id: 15, name: 'Timtim Sezar Pizza', description: 'İnce hamur, mozzarella, parmesan, sezar sos, sarımsak, tavuk, cherry domates, göbek yeşillik, bıldırcın yumurta', prices: { small: 300, medium: 360, large: 420 }, category: 'pizza', image: '/pizzas/Timtim Sezar Pizza.jpg' },
  { id: 16, name: 'Timtim Somonlu Pizza', description: 'İnce hamur, mozzarella, somon balığı, siyah zeytin, cherry domates, kremalı sos', prices: { small: 350, medium: 410, large: 470 }, category: 'pizza', image: '/pizzas/Timtim Somonlu Pizza.jpg' }
]

const CACHE_TTL = 30 * 60 * 1000
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
      if (now - cacheTime < CACHE_TTL) {
        return JSON.parse(cachedData) as T
      } else {
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

export const clearMenuCache = (): void => {
  localStorage.removeItem(MENU_CACHE_KEY)
  localStorage.removeItem(MENU_CACHE_TIME_KEY)
  localStorage.removeItem(CAMPAIGNS_CACHE_KEY)
  localStorage.removeItem(CAMPAIGNS_CACHE_TIME_KEY)
  localStorage.removeItem(CATEGORIES_CACHE_KEY)
  localStorage.removeItem(CATEGORIES_CACHE_TIME_KEY)
}

const getMenuData = async (forceRefresh = false): Promise<MenuItem[]> => {
  if (!forceRefresh) {
    const cached = getCachedData<MenuItem[]>(MENU_CACHE_KEY, MENU_CACHE_TIME_KEY)
    if (cached) return cached
  }
  try {
    const { data, error } = await supabase
      .from('timtim_pizza_menu')
      .select('*')
      .order('display_order', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching menu:', error)
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
        is_new: item.is_new || false,
        display_order: item.display_order || 0
      }))
      setCachedData(MENU_CACHE_KEY, MENU_CACHE_TIME_KEY, menuItems)
      return menuItems
    }
    return menuData
  } catch (error) {
    console.error('Error:', error)
    const cached = getCachedData<MenuItem[]>(MENU_CACHE_KEY, MENU_CACHE_TIME_KEY)
    return cached || menuData
  }
}

const getCampaigns = async (forceRefresh = false): Promise<Campaign[]> => {
  if (!forceRefresh) {
    const cached = getCachedData<Campaign[]>(CAMPAIGNS_CACHE_KEY, CAMPAIGNS_CACHE_TIME_KEY)
    if (cached) return cached
  }
  try {
    const { data, error } = await supabase
      .from('timtim_campaigns')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching campaigns:', error)
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
    setCachedData(CAMPAIGNS_CACHE_KEY, CAMPAIGNS_CACHE_TIME_KEY, campaigns)
    return campaigns
  } catch (error) {
    console.error('Error:', error)
    const cached = getCachedData<Campaign[]>(CAMPAIGNS_CACHE_KEY, CAMPAIGNS_CACHE_TIME_KEY)
    return cached || []
  }
}

const getCategories = async (forceRefresh = false): Promise<Category[]> => {
  if (!forceRefresh) {
    const cached = getCachedData<Category[]>(CATEGORIES_CACHE_KEY, CATEGORIES_CACHE_TIME_KEY)
    if (cached) return cached
  }
  try {
    const { data, error } = await supabase
      .from('timtim_categories')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
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
    setCachedData(CATEGORIES_CACHE_KEY, CATEGORIES_CACHE_TIME_KEY, categories)
    return categories
  } catch (error) {
    console.error('Error:', error)
    const cached = getCachedData<Category[]>(CATEGORIES_CACHE_KEY, CATEGORIES_CACHE_TIME_KEY)
    return cached || [
      { id: 1, name: 'pizza', label: 'Pizza', display_order: 1 },
      { id: 2, name: 'drink', label: 'İçecek', display_order: 2 },
      { id: 3, name: 'dessert', label: 'Tatlı', display_order: 3 }
    ]
  }
}

const resolveImage = (image: string, folder: 'pizzas' = 'pizzas') => {
  if (!image) return ''
  if (image.startsWith('data:image')) return image
  if (image.startsWith('http')) return image
  if (image.startsWith('/')) {
    const fileName = image.split('/').pop() || ''
    return `/${folder}/${encodeURIComponent(fileName)}`
  }
  return image
}

function FlameIcon({ className = 'w-5 h-5', strokeOnly = false }: { className?: string; strokeOnly?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.5 2.5c.6 2.1.2 3.7-1.3 4.9-1.9 1.5-3.1 3-3.7 4.4-.6 1.5-.5 3-.1 4.4-2.4-.8-3.9-3-3.9-5.6 0-3.4 2.5-6.5 5.9-8.1.6 .3 1.1 .8 1.5 1.4.3 .4 .8 .7 1.6-1.4z"
        fill={strokeOnly ? 'none' : '#D62828'}
        stroke={strokeOnly ? 'currentColor' : 'none'}
        strokeWidth={strokeOnly ? '1.6' : 0}
      />
      <path
        d="M12 22c4.4 0 8-3.3 8-7.5 0-2-1-3.9-2.4-5.2-.7 1.4-2.1 2.2-3.6 2.2 1.6-3.2.5-6-1.2-7.5-.4 2.5-2.1 4.3-4 5.7-1.9 1.4-3.8 3-3.8 5.8C5 18.7 8.6 22 12 22z"
        fill={strokeOnly ? 'none' : '#D62828'}
        stroke={strokeOnly ? 'currentColor' : 'none'}
        strokeWidth={strokeOnly ? '1.6' : 0}
      />
      <path
        d="M12 18.5c1.8 0 3.2-1.3 3.2-3 0-1-.5-1.8-1.2-2.3-.3 .8-1.1 1.3-2 1.3.6-1.5 0-2.8-.8-3.5-.2 1.2-1.1 2-2 2.8-.9 .8-1.6 1.5-1.6 2.7 0 1.7 1.4 3 2.4 3z"
        fill={strokeOnly ? 'none' : '#FFB627'}
      />
    </svg>
  )
}

function TimTimLogo({ size = 'hero', className = '' }: { size?: 'sm' | 'md' | 'lg' | 'hero'; className?: string }) {
  const sizes = {
    sm: 'w-[132px]',
    md: 'w-[168px]',
    lg: 'w-[204px]',
    hero: 'w-[92vw] max-w-[472px]'
  }

  return (
    <div
      className={`relative overflow-hidden ${sizes[size]} ${className}`}
      style={{ paddingBottom: `${(175 / 1024) * 100}%` }}
    >
      <img
        src="/logo-timtim-full.png"
        alt="TiMTiM Pizza"
        width={1024}
        height={283}
        className="absolute inset-0 w-full h-auto max-w-none select-none"
        draggable={false}
        decoding="sync"
      />
    </div>
  )
}

function BrandLogo({ size = 'md', onDark = false }: { size?: 'sm' | 'md' | 'lg' | 'hero'; onDark?: boolean }) {
  const padding = {
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2',
    lg: 'px-5 py-2.5',
    hero: 'px-6 py-4 md:px-8 md:py-5'
  }

  const logo = <TimTimLogo size={size} />

  if (onDark) {
    return (
      <div className={`inline-flex items-center bg-white rounded-2xl shadow-soft ${padding[size]}`}>
        {logo}
      </div>
    )
  }

  return logo
}

function StickyHeader({ scrolled, onMenuClick }: { scrolled: boolean; onMenuClick: () => void }) {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-brand-line shadow-soft'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-10 h-16 md:h-20 flex items-center justify-end">
        <button
          onClick={onMenuClick}
          className={`inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold tracking-[0.2em] uppercase transition-all duration-300 ${
            scrolled
              ? 'bg-brand-dark text-white hover:bg-brand-red shadow-soft'
              : 'bg-white/95 backdrop-blur text-brand-dark hover:bg-white shadow-[0_4px_14px_-2px_rgba(0,0,0,0.25)]'
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </svg>
          <span>Menü</span>
        </button>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative w-full bg-white">
      <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-10 pt-16 md:pt-20 pb-1 flex justify-center">
        <div className="anim-fade-in">
          <TimTimLogo size="hero" />
        </div>
      </div>
    </section>
  )
}

function CategoryTabs({
  categories,
  selected,
  onSelect
}: {
  categories: { name: string; label: string }[]
  selected: string
  onSelect: (name: string) => void
}) {
  return (
    <div className="sticky top-16 md:top-20 z-30 bg-brand-bg/92 backdrop-blur-md border-b border-brand-line">
      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-10">
        <div className="flex gap-2 md:gap-2.5 overflow-x-auto scrollbar-hide py-2.5 md:py-3">
          {categories.map(cat => {
            const isActive = selected === cat.name
            return (
              <button
                key={cat.name}
                onClick={() => onSelect(cat.name)}
                className={`relative flex-shrink-0 inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full text-sm md:text-[15px] font-medium transition-colors duration-300 ${
                  isActive
                    ? 'text-white'
                    : 'text-brand-dark hover:text-brand-red border border-brand-line bg-white/70'
                }`}
              >
                {isActive && (
                  <span className="absolute inset-0 bg-brand-red rounded-full shadow-[0_4px_12px_-2px_rgba(214,40,40,0.45)]" />
                )}
                <span className="relative z-10 whitespace-nowrap">
                  {cat.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ProductCard({ item, index }: { item: MenuItem; index: number }) {
  const imageSrc = resolveImage(item.image)
  const isPizza = item.category === 'pizza'
  const sizes = isPizza
    ? [
        { label: 'Küçük', dim: '24 cm', price: item.prices.small },
        { label: 'Orta', dim: '28 cm', price: item.prices.medium },
        { label: 'Büyük', dim: '32 cm', price: item.prices.large }
      ].filter(s => s.price > 0)
    : []

  const singlePrice = !isPizza
    ? (item.prices.small || item.prices.medium || item.prices.large)
    : 0

  return (
    <div
      className="group relative w-full bg-brand-card rounded-2xl overflow-hidden shadow-card border border-brand-line/60 anim-fade-up"
      style={{ animationDelay: `${Math.min(index * 0.04, 0.32)}s` }}
    >
      <div className="relative w-full overflow-hidden bg-white" style={{ paddingBottom: '75%' }}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              const parent = e.currentTarget.parentElement
              if (parent) {
                const fb = parent.querySelector('.img-fallback') as HTMLElement
                if (fb) fb.style.display = 'flex'
              }
            }}
          />
        ) : null}
        <div
          className="img-fallback absolute inset-0 items-center justify-center text-brand-muted text-sm"
          style={{ display: imageSrc ? 'none' : 'flex' }}
        >
          Görsel yok
        </div>

        {item.is_new && (
          <div className="absolute top-3 left-3 bg-brand-red text-white text-[10px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full shadow-[0_4px_10px_-2px_rgba(214,40,40,0.55)] z-10">
            Yeni
          </div>
        )}
      </div>

      <div className="px-5 pt-5 pb-5 md:px-6 md:pt-6 md:pb-6 flex flex-col">
        <h3 className="font-display font-bold text-xl md:text-2xl text-brand-dark mb-2 leading-tight tracking-tight">
          {item.name}
        </h3>
        <p className="text-[13px] md:text-sm text-brand-muted leading-relaxed mb-5">
          {item.description}
        </p>

        {isPizza && sizes.length > 0 ? (
          <div className="mt-auto pt-4 border-t border-brand-line">
            <div className="space-y-2">
              {sizes.map(s => (
                <div
                  key={s.label}
                  className="flex items-center justify-between bg-brand-bg/60 border border-brand-line rounded-xl px-3.5 py-2.5"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-sans font-semibold text-[15px] md:text-base text-brand-dark">
                      {s.label}
                    </span>
                    <span className="text-[11px] md:text-xs text-brand-muted">{s.dim}</span>
                  </div>
                  <span className="inline-flex items-baseline gap-0.5 font-sans text-xl md:text-2xl text-brand-red font-black leading-none tabular-nums tracking-tight">
                    {s.price}
                    <span className="text-[0.72em] font-black">₺</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : singlePrice ? (
          <div className="mt-auto pt-4 border-t border-brand-line flex items-center justify-end">
            <span className="inline-flex items-baseline gap-0.5 font-sans text-2xl md:text-[30px] text-brand-red font-black leading-none tabular-nums tracking-tight">
              {singlePrice}
              <span className="text-[0.72em] font-black">₺</span>
            </span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function ProductListItem({ item, index }: { item: MenuItem; index: number }) {
  const imageSrc = resolveImage(item.image)
  const price = item.prices.small || item.prices.medium || item.prices.large || 0

  return (
    <div
      className="group flex items-center gap-4 md:gap-5 bg-white rounded-2xl border border-brand-line/70 px-3 py-2 md:px-4 md:py-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card hover:border-brand-line anim-fade-up"
      style={{ animationDelay: `${Math.min(index * 0.035, 0.3)}s` }}
    >
      <div className="relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-white flex items-center justify-center">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-contain"
            style={{ transform: 'scale(2.6)', transformOrigin: 'center' }}
            draggable={false}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              const parent = e.currentTarget.parentElement
              if (parent) {
                const fb = parent.querySelector('.img-fallback') as HTMLElement
                if (fb) fb.style.display = 'flex'
              }
            }}
          />
        ) : null}
        <div
          className="img-fallback absolute inset-0 items-center justify-center text-brand-muted text-[9px] text-center px-1"
          style={{ display: imageSrc ? 'none' : 'flex' }}
        >
          Görsel yok
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-display font-semibold text-base md:text-lg text-brand-dark leading-tight truncate">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-[13px] md:text-sm text-brand-muted leading-snug truncate mt-0.5">
            {item.description}
          </p>
        )}
      </div>

      {price > 0 && (
        <div className="flex-shrink-0 pl-2">
          <span className="inline-flex items-baseline gap-0.5 font-sans text-xl md:text-2xl font-bold text-[#1E1E1E] leading-none tabular-nums tracking-tight">
            {price}
            <span className="text-[0.7em]">₺</span>
          </span>
        </div>
      )}
    </div>
  )
}

function CampaignCard({
  campaign,
  menuItems,
  index
}: {
  campaign: Campaign
  menuItems: MenuItem[]
  index: number
}) {
  const items = menuItems.filter(m => campaign.items.includes(m.id))
  const cover = campaign.image
    ? resolveImage(campaign.image)
    : items[0]?.image
    ? resolveImage(items[0].image)
    : ''

  return (
    <div
      className="bg-brand-card rounded-2xl overflow-hidden shadow-card border border-brand-line/60 anim-fade-up"
      style={{ animationDelay: `${Math.min(index * 0.04, 0.32)}s` }}
    >
      <div className="relative w-full overflow-hidden bg-brand-bg" style={{ paddingBottom: '75%' }}>
        {cover ? (
          <img
            src={cover}
            alt={campaign.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid grid-cols-2 gap-0.5">
            {items.slice(0, 4).map((m, i) => (
              <div key={i} className="overflow-hidden bg-brand-bg">
                {m.image && (
                  <img src={resolveImage(m.image)} alt={m.name} className="w-full h-full object-cover" />
                )}
              </div>
            ))}
          </div>
        )}
        <div
          className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(26,26,26,0.35), rgba(26,26,26,0.05) 60%, transparent)'
          }}
        />
        <div className="absolute top-3 left-3 bg-brand-dark text-white text-[10px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full shadow-sm z-10">
          Kampanya
        </div>
      </div>

      <div className="px-5 pt-5 pb-5 md:px-6 md:pt-6 md:pb-6 flex flex-col">
        <h3 className="font-display font-bold text-xl md:text-2xl text-brand-dark mb-2 leading-tight">
          {campaign.name}
        </h3>
        <p className="text-[13px] md:text-sm text-brand-muted leading-relaxed mb-4">
          {campaign.description}
        </p>

        {items.length > 0 && (
          <div className="mb-5">
            <div className="text-[10px] uppercase tracking-[0.22em] text-brand-dark/70 font-bold mb-2">
              İçerik
            </div>
            <div className="flex flex-wrap gap-1.5">
              {items.map(m => (
                <span
                  key={m.id}
                  className="text-[11px] md:text-xs text-brand-dark/80 bg-brand-bg border border-brand-line px-2.5 py-1 rounded-full"
                >
                  {m.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-brand-line flex items-end justify-between">
          <span className="text-[11px] uppercase tracking-[0.22em] text-brand-dark/70 font-bold">
            Kampanya Fiyatı
          </span>
          <span className="inline-flex items-baseline gap-0.5 font-sans text-[30px] md:text-[34px] text-brand-red font-black leading-none tabular-nums tracking-tight">
            {campaign.price}
            <span className="text-[0.72em] font-black">₺</span>
          </span>
        </div>
      </div>
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className="bg-brand-card rounded-2xl overflow-hidden border border-brand-line/60">
      <div className="w-full shimmer" style={{ paddingBottom: '80%' }} />
      <div className="px-4 md:px-5 pt-4 pb-4 space-y-3">
        <div className="h-5 w-2/3 shimmer rounded" />
        <div className="h-3 w-full shimmer rounded" />
        <div className="h-3 w-5/6 shimmer rounded" />
        <div className="h-px bg-brand-line my-3" />
        <div className="flex items-center justify-between">
          <div className="h-7 w-20 shimmer rounded" />
          <div className="h-4 w-14 shimmer rounded" />
        </div>
      </div>
    </div>
  )
}

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('pizza')
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const menuSectionRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const loadFromCache = (): boolean => {
      const m = getCachedData<MenuItem[]>(MENU_CACHE_KEY, MENU_CACHE_TIME_KEY)
      const c = getCachedData<Campaign[]>(CAMPAIGNS_CACHE_KEY, CAMPAIGNS_CACHE_TIME_KEY)
      const cat = getCachedData<Category[]>(CATEGORIES_CACHE_KEY, CATEGORIES_CACHE_TIME_KEY)
      const ok = !!(m && m.length > 0 && cat && cat.length > 0)
      if (m && m.length > 0) setMenuItems(m)
      if (c && c.length > 0) setCampaigns(c)
      if (cat && cat.length > 0) setCategories(cat)
      return ok
    }

    const fetchFresh = () =>
      Promise.all([getMenuData(false), getCampaigns(false), getCategories(false)])
        .then(([m, c, cat]) => {
          setMenuItems(m)
          setCampaigns(c)
          setCategories(cat)
          setIsLoading(false)
        })
        .catch(() => setIsLoading(false))

    if (loadFromCache()) {
      setIsLoading(false)
      const t = setTimeout(() => {
        Promise.all([getMenuData(true), getCampaigns(true), getCategories(true)])
          .then(([m, c, cat]) => {
            setMenuItems(m)
            setCampaigns(c)
            setCategories(cat)
          })
          .catch(() => {})
      }, 800)
      return () => clearTimeout(t)
    }

    const earlyPromise = (window as unknown as { __TIMTIM_INIT_PROMISE__?: Promise<boolean> })
      .__TIMTIM_INIT_PROMISE__

    if (earlyPromise) {
      setIsLoading(true)
      earlyPromise
        .then((ok) => {
          if (ok && loadFromCache()) {
            setIsLoading(false)
          } else {
            fetchFresh()
          }
        })
        .catch(() => fetchFresh())
      return
    }

    setIsLoading(true)
    fetchFresh()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const categoryLabels: Record<string, string> = {
    campaigns: 'Kampanyalar',
    ...categories.reduce((acc, cat) => {
      acc[cat.name] = cat.label
      return acc
    }, {} as Record<string, string>)
  }

  const tabCategories: { name: string; label: string }[] = [
    ...categories.map(c => ({ name: c.name, label: c.label })),
    ...(campaigns.length > 0 ? [{ name: 'campaigns', label: 'Kampanyalar' }] : [])
  ]

  const filteredMenu =
    selectedCategory === 'campaigns'
      ? []
      : menuItems.filter(item => item.category === selectedCategory)

  return (
    <div className="min-h-screen bg-brand-bg text-brand-dark">
      <StickyHeader
        scrolled={scrolled}
        onMenuClick={() => menuSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
      />
      <Hero />

      <div ref={menuSectionRef}>
        <CategoryTabs
          categories={tabCategories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <main className="max-w-6xl mx-auto px-4 md:px-8 lg:px-10 py-6 md:py-10">
          <div className="mb-5 md:mb-7 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-[0.28em] text-brand-red mb-1.5">
                <FlameIcon className="w-3 h-3" />
                Menü
              </div>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-brand-dark leading-tight">
                {categoryLabels[selectedCategory] || ''}
              </h2>
            </div>
          </div>

          <div key={selectedCategory} className="anim-fade-up-fast">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {[0, 1, 2, 3, 4, 5].map(i => <CardSkeleton key={i} />)}
                </div>
              ) : selectedCategory === 'campaigns' ? (
                campaigns.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {campaigns.map((c, i) => (
                      <CampaignCard key={c.id} campaign={c} menuItems={menuItems} index={i} />
                    ))}
                  </div>
                ) : (
                  <EmptyState text="Henüz kampanya bulunmamaktadır." />
                )
              ) : filteredMenu.length > 0 ? (
                selectedCategory === 'pizza' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {filteredMenu.map((item, i) => (
                      <ProductCard key={item.id} item={item} index={i} />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 md:gap-3">
                    {filteredMenu.map((item, i) => (
                      <ProductListItem key={item.id} item={item} index={i} />
                    ))}
                  </div>
                )
              ) : (
                <EmptyState text="Bu kategoride henüz ürün bulunmamaktadır." />
              )}
          </div>
        </main>

        <footer className="border-t border-brand-line bg-brand-bg">
          <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-12 py-8 flex flex-col items-center text-center">
            <BrandLogo size="md" />
            <div className="text-xs text-brand-muted tracking-[0.3em] uppercase mt-3">
              Afiyet olsun
            </div>
          </div>
        </footer>
      </div>

    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-full border border-brand-line flex items-center justify-center mb-4">
        <FlameIcon className="w-5 h-5 text-brand-muted" strokeOnly />
      </div>
      <p className="text-brand-muted text-sm md:text-base font-medium">{text}</p>
    </div>
  )
}

export default App
