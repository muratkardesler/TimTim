import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

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

const STORAGE_KEY = 'timtim_pizza_menu'

// localStorage utilities
const getMenuData = (): MenuItem[] => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  return []
}

const saveMenuData = (data: MenuItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

const ADMIN_USERNAME = 'timtim'
const ADMIN_PASSWORD = 'fatih123'

export default function AdminPanel() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      const data = getMenuData()
      if (data.length > 0) {
        setMenuItems(data)
      }
    }
  }, [isAuthenticated])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
    } else {
      setLoginError('Kullanıcı adı veya şifre hatalı!')
    }
  }

  // Login ekranı
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🍕</div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Admin Girişi</h1>
            <p className="text-gray-600">TimTim Pizza Admin Panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none font-medium"
                placeholder="Kullanıcı adınızı girin"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none font-medium"
                placeholder="Şifrenizi girin"
              />
            </div>

            {loginError && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl font-bold text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
            >
              Giriş Yap
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
            >
              Menüye Dön
            </button>
          </form>
        </div>
      </div>
    )
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setImagePreview(base64String)
        if (editingItem) {
          setEditingItem({ ...editingItem, image: base64String })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    
    const newItem: MenuItem = {
      id: editingItem?.id || Date.now(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      prices: {
        small: Number(formData.get('priceSmall')),
        medium: Number(formData.get('priceMedium')),
        large: Number(formData.get('priceLarge'))
      },
      category: 'pizza',
      image: imagePreview || editingItem?.image || ''
    }

    let updatedItems: MenuItem[]
    if (editingItem) {
      updatedItems = menuItems.map(item => 
        item.id === editingItem.id ? newItem : item
      )
    } else {
      updatedItems = [...menuItems, newItem]
    }

    setMenuItems(updatedItems)
    saveMenuData(updatedItems)
    setShowForm(false)
    setEditingItem(null)
    setImagePreview('')
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setImagePreview(item.image)
    setShowForm(true)
  }

  const handleDelete = (item: MenuItem) => {
    setItemToDelete(item)
  }

  const confirmDelete = () => {
    if (itemToDelete) {
      const updatedItems = menuItems.filter(item => item.id !== itemToDelete.id)
      setMenuItems(updatedItems)
      saveMenuData(updatedItems)
      setItemToDelete(null)
    }
  }

  const cancelDelete = () => {
    setItemToDelete(null)
  }

  const handleNew = () => {
    setEditingItem(null)
    setImagePreview('')
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingItem(null)
    setImagePreview('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-gray-900 mb-2">🍕 Admin Panel</h1>
              <p className="text-gray-600">Pizza menüsünü yönet</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
              >
                Menüye Dön
              </button>
              <button
                onClick={() => {
                  setIsAuthenticated(false)
                  setUsername('')
                  setPassword('')
                }}
                className="px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all"
              >
                Çıkış Yap
              </button>
              <button
                onClick={handleNew}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
              >
                + Yeni Pizza Ekle
              </button>
            </div>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-black text-gray-900 mb-6">
                  {editingItem ? 'Pizza Düzenle' : 'Yeni Pizza Ekle'}
                </h2>
                
                <form onSubmit={handleSave} className="space-y-6">
                  {/* Pizza Adı */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Pizza Adı *
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editingItem?.name || ''}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none font-medium"
                      placeholder="Örn: Margarita Pizza"
                    />
                  </div>

                  {/* Açıklama */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Açıklama *
                    </label>
                    <textarea
                      name="description"
                      defaultValue={editingItem?.description || ''}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none font-medium resize-none"
                      placeholder="Pizza içeriğini açıkla..."
                    />
                  </div>

                  {/* Fiyatlar */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Küçük (24cm) *
                      </label>
                      <input
                        type="number"
                        name="priceSmall"
                        defaultValue={editingItem?.prices.small || ''}
                        required
                        min="0"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none font-medium"
                        placeholder="₺"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Orta (28cm) *
                      </label>
                      <input
                        type="number"
                        name="priceMedium"
                        defaultValue={editingItem?.prices.medium || ''}
                        required
                        min="0"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none font-medium"
                        placeholder="₺"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Büyük (32cm) *
                      </label>
                      <input
                        type="number"
                        name="priceLarge"
                        defaultValue={editingItem?.prices.large || ''}
                        required
                        min="0"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none font-medium"
                        placeholder="₺"
                      />
                    </div>
                  </div>

                  {/* Resim Yükleme */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Pizza Görseli
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none"
                    />
                    {imagePreview && (
                      <div className="mt-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-xl border-2 border-gray-300"
                        />
                      </div>
                    )}
                    {editingItem?.image && !imagePreview && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Mevcut görsel:</p>
                        <img
                          src={editingItem.image}
                          alt="Current"
                          className="w-full h-48 object-cover rounded-xl border-2 border-gray-300"
                        />
                      </div>
                    )}
                  </div>

                  {/* Butonlar */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
                    >
                      {editingItem ? 'Güncelle' : 'Kaydet'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                    >
                      İptal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Silme Onay Modalı */}
        {itemToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
              <div className="p-6">
                {/* İkon ve Başlık */}
                <div className="text-center mb-6">
                  <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 mb-2">
                    Pizzayı Sil?
                  </h2>
                  <p className="text-gray-600">
                    Bu işlem geri alınamaz
                  </p>
                </div>

                {/* Silinecek Pizza Bilgisi */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6 border-2 border-gray-200">
                  <div className="flex items-center gap-4">
                    {itemToDelete.image && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={itemToDelete.image}
                          alt={itemToDelete.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-black text-lg text-gray-900 mb-1">
                        {itemToDelete.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {itemToDelete.description}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold">
                          K: {itemToDelete.prices.small}₺
                        </span>
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-bold">
                          O: {itemToDelete.prices.medium}₺
                        </span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">
                          B: {itemToDelete.prices.large}₺
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Uyarı Mesajı */}
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-sm text-red-800 font-semibold">
                      <strong>Dikkat:</strong> Bu pizzayı silersen, menüden tamamen kaldırılacak ve bu işlem geri alınamaz.
                    </p>
                  </div>
                </div>

                {/* Butonlar */}
                <div className="flex gap-3">
                  <button
                    onClick={cancelDelete}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                  >
                    İptal
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
                  >
                    Evet, Sil
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pizza Listesi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
            >
              {/* Görsel */}
              <div className="w-full h-48 bg-gray-200 overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    🍕
                  </div>
                )}
              </div>

              {/* İçerik */}
              <div className="p-5">
                <h3 className="text-xl font-black text-gray-900 mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                
                <div className="flex gap-2 mb-4 text-sm">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">
                    K: {item.prices.small}₺
                  </span>
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-bold">
                    O: {item.prices.medium}₺
                  </span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                    B: {item.prices.large}₺
                  </span>
                </div>

                {/* Butonlar */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {menuItems.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">🍕</div>
            <p className="text-gray-500 text-lg font-semibold mb-4">Henüz pizza eklenmemiş</p>
            <button
              onClick={handleNew}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
            >
              İlk Pizzayı Ekle
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

