const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Categories');
const Product = require('./models/Product');
const Brand = require('./models/Brands');

dotenv.config();

const flowerCategories = [
  {
    name: 'Tasarım Buketler',
    slug: 'tasarim-buketler',
    description: 'Günlük taze çiçeklerle hazırlanan özel tasarım buketler.',
    image: 'https://images.unsplash.com/photo-1583327171620-ca4803739b7c?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Zarif Güller',
    slug: 'guller',
    description: 'Aşkın ve zerafetin simgesi en taze güller.',
    image: 'https://images.unsplash.com/photo-1548683311-e1c503ffb1c5?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Lüks Orkideler',
    slug: 'orkideler',
    description: 'Zerafetiyle mekanları süsleyen asil orkideler.',
    image: 'https://images.unsplash.com/photo-1534885412334-dfcaaa936558?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Saksı Çiçekleri',
    slug: 'saksi-cicekleri',
    description: 'Evinize canlılık katacak uzun ömürlü saksı çiçekleri.',
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=800&auto=format&fit=crop'
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Brand.deleteMany({});

    // Seed Brand
    const doreAdemBrand = await Brand.create({
      name: 'Dore Adem',
      description: 'Zerafetin ve tazeliğin adresi.'
    });
    console.log('Brand seeded!');

    // Seed Categories
    const createdCategories = [];
    for (const catData of flowerCategories) {
      const cat = new Category(catData);
      await cat.save();
      createdCategories.push(cat);
    }
    console.log('Categories seeded!');

    // Seed Products
    const productsData = [
      {
        name: 'Kızıl Aşk Buketi',
        description: '12 adet taze kırmızı gül ve mevsim yeşillikleri.',
        price: 850,
        category: createdCategories.find(c => c.name === 'Zarif Güller')._id,
        brand: doreAdemBrand._id,
        images: ['https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800&auto=format&fit=crop'],
        stock: 50,
        featured: true
      },
      {
        name: 'Beyaz Zerafet Orkide',
        description: 'Çift dallı beyaz phalaenopsis orkide.',
        price: 1200,
        category: createdCategories.find(c => c.name === 'Lüks Orkideler')._id,
        brand: doreAdemBrand._id,
        images: ['https://images.unsplash.com/photo-1599395231932-d17730e0600a?q=80&w=800&auto=format&fit=crop'],
        stock: 20,
        featured: true
      },
      {
        name: 'Bahar Esintisi Buket',
        description: 'Karışık mevsim çiçekleri ve papatyalar.',
        price: 650,
        category: createdCategories.find(c => c.name === 'Tasarım Buketler')._id,
        brand: doreAdemBrand._id,
        images: ['https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop'],
        stock: 30,
        featured: true
      }
    ];

    for (const prodData of productsData) {
      const prod = new Product(prodData);
      await prod.save();
    }
    console.log('Sample products seeded!');

    console.log('Seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
