// Görsellerden otomatik menü oluştur
const fs = require('fs');
const path = require('path');

const pizzasDir = path.join(__dirname, 'public', 'pizzas');
const outputFile = path.join(__dirname, 'src', 'menu-data.ts');

// Görselleri oku
const files = fs.readdirSync(pizzasDir).filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png'));

// Pizza isimlerini çıkar (dosya adından .jpg'yi kaldır)
const pizzas = files.map((file, index) => {
  const name = file.replace(/\.(jpg|jpeg|png)$/i, '').trim();
  // "büyük boy" gibi ekleri temizle
  const cleanName = name.replace(/\s*-\s*büyük\s*boy\s*/i, '').trim();
  
  return {
    id: index + 1,
    name: cleanName,
    description: 'Lezzetli pizza',
    prices: { 
      small: 85 + (index * 5), 
      medium: 120 + (index * 10), 
      large: 150 + (index * 15) 
    },
    category: 'pizza' as const,
    image: `/pizzas/${file}`
  };
});

// TypeScript dosyası oluştur
const tsContent = `// Otomatik oluşturuldu - generate-menu.js ile güncellenebilir
export interface PizzaSize {
  small: number
  medium: number
  large: number
}

export interface MenuItem {
  id: number
  name: string
  description: string
  prices: PizzaSize
  category: 'pizza' | 'drink' | 'dessert'
  image: string
}

export const menuData: MenuItem[] = ${JSON.stringify(pizzas, null, 2)}
`;

fs.writeFileSync(outputFile, tsContent);
console.log(`✅ ${pizzas.length} pizza menüye eklendi!`);
console.log(`📁 Dosya: ${outputFile}`);

