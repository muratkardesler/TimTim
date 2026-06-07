import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

function BrandLogo({ size = 'md', variant = 'dark' }: { size?: 'sm' | 'md' | 'lg' | 'xl' | 'splash'; variant?: 'dark' | 'light' }) {
  const sizes = {
    sm: { wrap: 'gap-0.5', flame: 'w-3 h-3 mb-0.5', top: 'text-base', bottom: 'text-[10px] tracking-[0.35em]' },
    md: { wrap: 'gap-1', flame: 'w-4 h-4 mb-0.5', top: 'text-xl', bottom: 'text-[11px] tracking-[0.4em]' },
    lg: { wrap: 'gap-1', flame: 'w-6 h-6 mb-1', top: 'text-3xl', bottom: 'text-sm tracking-[0.45em]' },
    xl: { wrap: 'gap-2', flame: 'w-10 h-10 mb-1', top: 'text-5xl md:text-6xl', bottom: 'text-base tracking-[0.5em]' },
    splash: { wrap: 'gap-3', flame: 'w-14 h-14 mb-2', top: 'text-6xl md:text-7xl', bottom: 'text-lg md:text-xl tracking-[0.55em]' }
  }
  const s = sizes[size]
  const topColor = variant === 'light' ? 'text-white' : 'text-brand-dark'

  return (
    <div className={`inline-flex flex-col items-center ${s.wrap} leading-none select-none`}>
      <FlameIcon className={s.flame} />
      <div className={`font-display font-bold ${topColor} ${s.top} tracking-tight`}>TIMTIM</div>
      <div className={`font-display font-semibold text-brand-red ${s.bottom} uppercase`}>Pizza</div>
    </div>
  )
}

function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 50% at 30% 70%, rgba(255,255,255,0.10), transparent 70%), radial-gradient(50% 40% at 70% 30%, rgba(255,255,255,0.07), transparent 70%)'
        }}
        animate={{ opacity: [0.6, 1, 0.7] }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(35% 25% at 50% 55%, rgba(214,40,40,0.18), transparent 70%), radial-gradient(20% 18% at 35% 45%, rgba(255,182,39,0.12), transparent 70%)'
        }}
        animate={{ opacity: [0.4, 0.9, 0.5], scale: [1, 1.08, 1.02] }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(30% 20% at 60% 80%, rgba(180,180,180,0.10), transparent 70%), radial-gradient(28% 22% at 25% 80%, rgba(220,220,220,0.08), transparent 70%)'
        }}
        animate={{ y: [10, -8, 4], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
        animate={{
          opacity: [0, 1, 1, 0],
          scale: [0.96, 1, 1, 1.02],
          filter: ['blur(8px)', 'blur(0px)', 'blur(0px)', 'blur(2px)']
        }}
        transition={{ duration: 1, times: [0, 0.35, 0.75, 1], ease: 'easeInOut' }}
      >
        <BrandLogo size="splash" variant="light" />
      </motion.div>
    </motion.div>
  )
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
      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-10 h-16 md:h-20 flex items-center justify-between">
        <a href="/" className="flex items-center">
          <BrandLogo size="sm" variant={scrolled ? 'dark' : 'light'} />
        </a>
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
    <section
      className="relative w-full overflow-hidden bg-[#0A0606]"
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ scale: 1.06, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          backgroundImage: 'url(/hero-pizza.png)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'right center'
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, #0A0606 0%, rgba(10,6,6,0.95) 22%, rgba(10,6,6,0.65) 42%, rgba(10,6,6,0.2) 60%, rgba(10,6,6,0) 78%)'
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,6,6,0.45) 0%, rgba(10,6,6,0) 22%, rgba(10,6,6,0) 75%, rgba(10,6,6,0.55) 100%)'
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            'radial-gradient(80% 100% at 80% 50%, rgba(255,140,40,0.10), transparent 60%)'
        }}
      />

      <div className="relative max-w-6xl mx-auto px-5 md:px-10 lg:px-12 pt-24 md:pt-28 pb-10 md:pb-12">
        <div className="relative z-10 min-h-[280px] md:min-h-[380px] lg:min-h-[440px] flex flex-col justify-center max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-[92px] leading-[0.95] text-white mb-5 md:mb-6 tracking-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.65)]">
              TIMTIM
              <br />
              <span className="text-brand-red">PIZZA</span>
            </h1>
            <div className="inline-flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] md:text-sm text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]">
              <span className="inline-flex items-center gap-2">
                <CategoryIcon name="pizza" className="w-4 h-4 text-brand-red" />
                <span className="font-medium">Pizza</span>
              </span>
              <span className="text-brand-red/70">•</span>
              <span className="inline-flex items-center gap-2">
                <CategoryIcon name="drink" className="w-4 h-4 text-brand-red" />
                <span className="font-medium">İçecek</span>
              </span>
              <span className="text-brand-red/70">•</span>
              <span className="inline-flex items-center gap-2">
                <CategoryIcon name="dessert" className="w-4 h-4 text-brand-red" />
                <span className="font-medium">Tatlı</span>
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-8 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, transparent, #FAF7F2)'
        }}
      />
    </section>
  )
}

function CategoryIcon({ name, className = 'w-4 h-4' }: { name: string; className?: string }) {
  if (name === 'pizza') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 L22 20 L2 20 Z" />
        <circle cx="9" cy="14" r="1" fill="currentColor" />
        <circle cx="14" cy="13" r="1" fill="currentColor" />
        <circle cx="12" cy="17" r="1" fill="currentColor" />
      </svg>
    )
  }
  if (name === 'drink') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4h12l-1 5a5 5 0 0 1-10 0z" />
        <path d="M9 21h6" />
        <path d="M12 13v8" />
      </svg>
    )
  }
  if (name === 'dessert') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18h18" />
        <path d="M5 18l1-7a6 6 0 0 1 12 0l1 7" />
        <path d="M12 4v3" />
      </svg>
    )
  }
  if (name === 'campaigns') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="8" width="18" height="13" rx="1.5" />
        <path d="M3 12h18" />
        <path d="M12 8v13" />
        <path d="M7.5 8a2.5 2.5 0 0 1 0-5C9.5 3 12 5 12 8c0-3 2.5-5 4.5-5a2.5 2.5 0 0 1 0 5" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
    </svg>
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
        <div className="flex gap-2 md:gap-2.5 overflow-x-auto scrollbar-hide py-3 md:py-3.5">
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
                  <motion.span
                    layoutId="active-pill"
                    className="absolute inset-0 bg-brand-red rounded-full shadow-[0_4px_12px_-2px_rgba(214,40,40,0.45)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10 inline-flex items-center gap-2 whitespace-nowrap">
                  <CategoryIcon name={cat.name} className="w-4 h-4" />
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

function PriceBadge({ item }: { item: MenuItem }) {
  const isPizza = item.category === 'pizza'
  const minPrice = isPizza
    ? Math.min(...[item.prices.small, item.prices.medium, item.prices.large].filter(p => p > 0))
    : (item.prices.small || item.prices.medium || item.prices.large)

  if (!minPrice || !isFinite(minPrice)) return null

  return (
    <div className="flex flex-col items-start leading-none">
      {isPizza && (
        <span className="text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-brand-muted font-medium mb-1">
          Başlangıç
        </span>
      )}
      <span className="font-display text-[26px] md:text-[30px] text-brand-red font-bold leading-none">
        {minPrice}
        <span className="text-lg md:text-xl ml-0.5">₺</span>
      </span>
    </div>
  )
}

function ProductCard({
  item,
  onClick,
  index
}: {
  item: MenuItem
  onClick: () => void
  index: number
}) {
  const imageSrc = resolveImage(item.image)

  return (
    <motion.button
      onClick={onClick}
      className="group relative w-full text-left bg-brand-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 border border-brand-line/60 hover:border-brand-red/30"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.04, 0.32),
        ease: [0.22, 1, 0.36, 1]
      }}
      whileTap={{ scale: 0.985 }}
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-brand-bg">
        {imageSrc ? (
          <motion.img
            src={imageSrc}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.04 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
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

        <div
          className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(26,26,26,0.35), rgba(26,26,26,0.05) 60%, transparent)'
          }}
        />

        {item.is_new && (
          <div className="absolute top-3 left-3 bg-brand-red text-white text-[10px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full shadow-[0_4px_10px_-2px_rgba(214,40,40,0.55)] z-10">
            Yeni
          </div>
        )}
      </div>

      <div className="px-4 md:px-5 pt-4 pb-4">
        <h3 className="font-display font-semibold text-lg md:text-xl text-brand-dark mb-1.5 leading-tight tracking-tight line-clamp-1">
          {item.name}
        </h3>
        <p className="text-[13px] md:text-sm text-brand-muted leading-snug line-clamp-2 mb-3 min-h-[2.4em]">
          {item.description}
        </p>

        <div className="flex items-end justify-between pt-3 border-t border-brand-line">
          <PriceBadge item={item} />
          <span className="inline-flex items-center gap-1 text-xs md:text-sm text-brand-dark group-hover:text-brand-red transition-colors font-semibold pb-0.5">
            İncele
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </span>
        </div>
      </div>
    </motion.button>
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
    <motion.div
      className="bg-brand-card rounded-2xl overflow-hidden shadow-card border border-brand-line/60"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.04, 0.32),
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-brand-bg">
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

      <div className="px-4 md:px-5 pt-4 pb-4">
        <h3 className="font-display font-semibold text-lg md:text-xl text-brand-dark mb-1.5 leading-tight line-clamp-1">
          {campaign.name}
        </h3>
        <p className="text-[13px] md:text-sm text-brand-muted leading-snug line-clamp-2 mb-3">
          {campaign.description}
        </p>

        {items.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {items.map(m => (
              <span
                key={m.id}
                className="text-[11px] text-brand-dark/70 bg-brand-bg border border-brand-line px-2 py-0.5 rounded-full"
              >
                {m.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-end justify-between pt-3 border-t border-brand-line">
          <div className="flex flex-col items-start leading-none">
            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-brand-muted font-medium mb-1">
              Kampanya
            </span>
            <span className="font-display text-[28px] md:text-[32px] text-brand-red font-bold leading-none">
              {campaign.price}
              <span className="text-lg md:text-xl ml-0.5">₺</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ProductDetailSheet({
  item,
  onClose,
  categoryLabel
}: {
  item: MenuItem | null
  onClose: () => void
  categoryLabel: string
}) {
  const isPizza = item?.category === 'pizza'
  const sizes = isPizza && item
    ? [
        { label: 'Küçük', dim: '24 cm', price: item.prices.small },
        { label: 'Orta', dim: '28 cm', price: item.prices.medium },
        { label: 'Büyük', dim: '32 cm', price: item.prices.large }
      ].filter(s => s.price > 0)
    : []

  const [selectedSize, setSelectedSize] = useState<string>('')

  useEffect(() => {
    if (sizes.length > 0) {
      const min = sizes.reduce((a, b) => (a.price <= b.price ? a : b))
      setSelectedSize(min.label)
    } else {
      setSelectedSize('')
    }
  }, [item?.id])

  useEffect(() => {
    if (item) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [item])

  return (
    <AnimatePresence>
      {item && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-brand-dark/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed z-50 left-0 right-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-brand-card w-full md:max-w-4xl lg:max-w-5xl rounded-t-3xl md:rounded-3xl shadow-sheet overflow-hidden flex flex-col md:flex-row max-h-[92vh] md:max-h-[86vh] md:min-h-[520px]"
              initial={{ y: '100%', opacity: 0.8, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 32, stiffness: 320 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.4 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 120 || info.velocity.y > 600) onClose()
              }}
            >
              <div className="md:hidden flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
                <div className="w-10 h-1.5 bg-brand-line rounded-full" />
              </div>

              <div className="relative w-full md:w-1/2 lg:w-[55%] aspect-[5/3] md:aspect-auto md:h-auto overflow-hidden flex-shrink-0 bg-brand-bg">
                {item.image ? (
                  <img
                    src={resolveImage(item.image)}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-muted">
                    Görsel yok
                  </div>
                )}
                <div
                  className="absolute inset-x-0 bottom-0 h-20 pointer-events-none md:hidden"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(26,26,26,0.25), transparent)'
                  }}
                />
                <div
                  className="absolute inset-y-0 right-0 w-16 pointer-events-none hidden md:block"
                  style={{
                    background:
                      'linear-gradient(to left, rgba(250,247,242,0.45), transparent)'
                  }}
                />
                {item.is_new && (
                  <div className="absolute top-4 left-4 bg-brand-red text-white text-[10px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full shadow-[0_4px_10px_-2px_rgba(214,40,40,0.55)] z-10">
                    Yeni
                  </div>
                )}
              </div>

              <button
                onClick={onClose}
                aria-label="Kapat"
                className="absolute top-3 right-3 md:top-4 md:right-4 w-10 h-10 rounded-full bg-white/95 backdrop-blur shadow-soft flex items-center justify-center text-brand-dark hover:bg-white hover:text-brand-red transition-colors z-20"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="flex-1 flex flex-col overflow-y-auto bg-brand-card">
                <div className="px-5 md:px-8 lg:px-10 pt-5 md:pt-10 pb-6 md:pb-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-[10px] md:text-[11px] uppercase tracking-[0.28em] text-brand-red font-semibold mb-3">
                    <FlameIcon className="w-3.5 h-3.5" />
                    {categoryLabel}
                  </div>
                  <h2 className="font-display font-bold text-2xl md:text-[34px] lg:text-4xl text-brand-dark leading-[1.1] mb-3 md:mb-4">
                    {item.name}
                  </h2>
                  <p className="text-sm md:text-[15px] text-brand-muted leading-relaxed mb-5 md:mb-6">
                    {item.description}
                  </p>

                  <div className="border-t border-brand-line mb-5 md:mb-6" />

                  {sizes.length > 0 ? (
                    <div>
                      <div className="text-[10px] md:text-[11px] uppercase tracking-[0.28em] text-brand-dark font-bold mb-3 md:mb-4">
                        Boyut Seçenekleri
                      </div>
                      <div className="space-y-2.5">
                        {sizes.map(s => {
                          const active = selectedSize === s.label
                          return (
                            <button
                              key={s.label}
                              onClick={() => setSelectedSize(s.label)}
                              className={`w-full flex items-center justify-between rounded-xl px-4 md:px-5 py-3.5 md:py-4 transition-all duration-200 border ${
                                active
                                  ? 'bg-brand-red/5 border-brand-red shadow-[0_2px_10px_-2px_rgba(214,40,40,0.22)]'
                                  : 'bg-brand-bg/60 border-brand-line hover:border-brand-red/40 hover:bg-white'
                              }`}
                            >
                              <div className="flex items-center gap-3 md:gap-4">
                                <span
                                  className={`relative w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                                    active ? 'border-brand-red' : 'border-brand-line'
                                  }`}
                                >
                                  {active && (
                                    <motion.span
                                      layoutId="size-dot"
                                      className="block w-2.5 h-2.5 rounded-full bg-brand-red"
                                      transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                                    />
                                  )}
                                </span>
                                <div className="flex items-baseline gap-2.5 md:gap-3">
                                  <span className="font-display font-semibold text-base md:text-lg text-brand-dark">
                                    {s.label}
                                  </span>
                                  <span className="text-xs md:text-sm text-brand-muted">{s.dim}</span>
                                </div>
                              </div>
                              <span className="font-display text-lg md:text-xl text-brand-red font-bold">
                                {s.price}
                                <span className="text-sm ml-0.5">₺</span>
                              </span>
                            </button>
                          )
                        })}
                      </div>
                      <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-brand-muted">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="16" x2="12" y2="12" />
                          <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        Fiyatlar seçilen boyuta göre değişmektedir.
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-brand-red/5 border border-brand-red/30 rounded-xl px-5 py-4">
                      <span className="text-brand-dark font-semibold">Fiyat</span>
                      <span className="font-display text-2xl md:text-3xl text-brand-red font-bold">
                        {item.prices.small || item.prices.medium || item.prices.large}
                        <span className="text-lg ml-0.5">₺</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function CardSkeleton() {
  return (
    <div className="bg-brand-card rounded-2xl overflow-hidden border border-brand-line/60">
      <div className="w-full aspect-[5/4] shimmer" />
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
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === 'undefined') return false
    return sessionStorage.getItem('timtim_splash_seen') !== '1'
  })
  const [selectedCategory, setSelectedCategory] = useState<string>('pizza')
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const menuSectionRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const cachedMenu = getCachedData<MenuItem[]>(MENU_CACHE_KEY, MENU_CACHE_TIME_KEY)
    const cachedCampaigns = getCachedData<Campaign[]>(CAMPAIGNS_CACHE_KEY, CAMPAIGNS_CACHE_TIME_KEY)
    const cachedCategories = getCachedData<Category[]>(CATEGORIES_CACHE_KEY, CATEGORIES_CACHE_TIME_KEY)

    if (cachedMenu && cachedMenu.length > 0) {
      setMenuItems(cachedMenu)
      setIsLoading(false)
    }
    if (cachedCampaigns && cachedCampaigns.length > 0) setCampaigns(cachedCampaigns)
    if (cachedCategories && cachedCategories.length > 0) setCategories(cachedCategories)
  }, [])

  useEffect(() => {
    const cachedMenu = getCachedData<MenuItem[]>(MENU_CACHE_KEY, MENU_CACHE_TIME_KEY)

    if (cachedMenu && cachedMenu.length > 0) {
      const updateTimer = setTimeout(() => {
        Promise.all([getMenuData(false), getCampaigns(false), getCategories(false)])
          .then(([m, c, cat]) => {
            setMenuItems(m)
            setCampaigns(c)
            setCategories(cat)
          })
          .catch(() => {})
      }, 500)
      return () => clearTimeout(updateTimer)
    }

    setIsLoading(true)
    Promise.all([getMenuData(false), getCampaigns(false), getCategories(false)])
      .then(([m, c, cat]) => {
        setMenuItems(m)
        setCampaigns(c)
        setCategories(cat)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSplashDone = () => {
    sessionStorage.setItem('timtim_splash_seen', '1')
    setShowSplash(false)
  }

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
      <AnimatePresence>{showSplash && <SplashScreen onDone={handleSplashDone} />}</AnimatePresence>

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

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {filteredMenu.map((item, i) => (
                    <ProductCard
                      key={item.id}
                      item={item}
                      index={i}
                      onClick={() => setSelectedItem(item)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState text="Bu kategoride henüz ürün bulunmamaktadır." />
              )}
            </motion.div>
          </AnimatePresence>
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

      <ProductDetailSheet
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        categoryLabel={categoryLabels[selectedItem?.category || ''] || ''}
      />
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
