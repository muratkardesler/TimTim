import { useState } from 'react'

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

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', 'pizza']
  const categoryLabels: Record<string, string> = {
    all: 'Tümü',
    pizza: 'Pizza'
  }

  const sizeLabels: Record<string, string> = {
    small: 'Küçük',
    medium: 'Orta',
    large: 'Büyük'
  }

  const filteredMenu = selectedCategory === 'all' 
    ? menuData 
    : menuData.filter(item => item.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pb-20">
      {/* Header - Sticky */}
      <header className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-xl sticky top-0 z-20">
        <div className="flex items-center justify-center h-20 md:h-28 px-4">
          {/* Logo - Centered and Scaled */}
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
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full font-bold text-sm md:text-base whitespace-nowrap transition-all flex-shrink-0 shadow-md ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                }`}
              >
                {categoryLabels[category]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu List - Grid Layout */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenu.map(item => {
            // Görsel path'i oluştur
            const imageFileName = item.image.split('/').pop() || ''
            const imagePath = `/pizzas/${encodeURIComponent(imageFileName)}`
            
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                {/* Image - Full Width Top */}
                <div className="w-full h-56 md:h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden relative">
                  {item.image ? (
                    <img 
                      src={imagePath} 
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
                        <div className="flex-1 text-center bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-3 border border-red-100 shadow-sm hover:shadow-md transition-shadow">
                          <div className="text-[10px] md:text-xs font-black text-red-700 uppercase tracking-wider mb-1.5">Küçük</div>
                          <div className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-600 to-red-700">
                            {item.prices.small}₺
                          </div>
                        </div>
                        <div className="w-px h-16 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                        <div className="flex-1 text-center bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-3 border border-red-100 shadow-sm hover:shadow-md transition-shadow">
                          <div className="text-[10px] md:text-xs font-black text-red-700 uppercase tracking-wider mb-1.5">Orta</div>
                          <div className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-600 to-red-700">
                            {item.prices.medium}₺
                          </div>
                        </div>
                        <div className="w-px h-16 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                        <div className="flex-1 text-center bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-3 border border-red-100 shadow-sm hover:shadow-md transition-shadow">
                          <div className="text-[10px] md:text-xs font-black text-red-700 uppercase tracking-wider mb-1.5">Büyük</div>
                          <div className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-600 to-red-700">
                            {item.prices.large}₺
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
                        <span className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-600 to-red-700">
                          {item.prices.small}₺
                        </span>
                        <span className="text-xs md:text-sm text-gray-700 bg-white px-4 py-2 rounded-full font-black uppercase tracking-wider shadow-sm border border-gray-200">
                          {categoryLabels[item.category]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredMenu.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍕</div>
            <p className="text-gray-500 text-lg md:text-xl font-semibold">Bu kategoride ürün bulunamadı.</p>
          </div>
        )}
      </div>

    </div>
  )
}

export default App
