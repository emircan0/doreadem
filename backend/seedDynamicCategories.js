const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Categories');
const Product = require('./models/Product');
const Brand = require('./models/Brands');

dotenv.config();

const categoriesData = [
  // Navbar Categories
  { name: 'Tasarım Buketler', slug: 'tasarim-buketler', icon: '🌸', location: 'navbar' },
  { name: 'Zarif Güller', slug: 'guller', icon: '🌹', location: 'both' },
  { name: 'Lüks Orkideler', slug: 'orkideler', icon: 'both' },
  { name: 'Saksı Çiçekleri', slug: 'saksi-cicekleri', icon: '🪴', location: 'both' },
  
  // Sidebar/Special Categories
  { name: 'Tebrik & Kutlama', slug: 'tebrik', icon: '🎉', location: 'sidebar' },
  { name: 'Yıldönümü', slug: 'yildonumu', icon: '❤️', location: 'sidebar' },
  { name: 'Doğum Günü', slug: 'dogum-gunu', icon: '🎂', location: 'sidebar' },
  
  // Others
  { name: 'Premium Seri', slug: 'premium-seri', icon: '💎', location: 'navbar' },
  { name: 'Yeni İş', slug: 'yeni-is', icon: '💼', location: 'sidebar' }
];

const productsData = [
  {
    name: 'Kızıl Aşk 50 Gül',
    price: 3450,
    categories: ['Zarif Güller', 'Yıldönümü', 'Doğum Günü'],
    description: 'Tutkunun simgesi kırmız güllerle hazırlanan devasa buket.',
    images: ['https://images.unsplash.com/photo-1548683311-e1c503ffb1c5?q=80&w=1200'],
    featured: true
  },
  {
    name: 'Beyaz Bulut Orkide',
    price: 1850,
    categories: ['Lüks Orkideler', 'Yeni İş', 'Tebrik & Kutlama'],
    description: 'Zerafetin simgesi çift dallı beyaz orkide.',
    images: ['https://images.unsplash.com/photo-1534885412334-dfcaaa936558?q=80&w=1200'],
    featured: true
  },
  {
    name: 'Bahar Esintisi Mix',
    price: 1250,
    categories: ['Tasarım Buketler', 'Doğum Günü'],
    description: 'Mevsim çiçeklerinden oluşan renkli ve neşeli bir aranjman.',
    images: ['https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1200']
  },
  {
    name: 'Premium Şampanya Gülleri',
    price: 2200,
    categories: ['Premium Seri', 'Güller', 'Yıldönümü'],
    description: 'Ender bulunan şampanya rengi ithal güller.',
    images: ['https://images.unsplash.com/photo-1582228784033-90d989f66068?q=80&w=1200'],
    featured: true
  },
  {
    name: 'Saksıda Lavanta Rüyası',
    price: 850,
    categories: ['Saksı Çiçekleri', 'Yeni İş'],
    description: 'Huzur veren kokusuyla saksıda taze lavantalar.',
    images: ['https://images.unsplash.com/photo-1515549832467-8783363e1927?q=80&w=1200']
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for dynamic seeding...');

    // Clear old
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Brand.deleteMany({});

    const doreBrand = await Brand.create({ name: 'Dore Adem', description: 'Premium Çiçek Butiği' });

    // Seed Categories
    const catMap = {};
    for (const c of categoriesData) {
      const created = await Category.create(c);
      catMap[c.name] = created._id;
    }
    console.log('Dynamic Categories seeded.');

    // Seed Products
    for (const p of productsData) {
      const categoryIds = p.categories.map(name => catMap[name]).filter(Boolean);
      await Product.create({
        ...p,
        categories: categoryIds,
        brand: doreBrand._id,
        stock: 20
      });
    }
    console.log('Products with multi-category seeded.');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();
