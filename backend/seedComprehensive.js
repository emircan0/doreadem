const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Categories');
const Product = require('./models/Product');
const Brand = require('./models/Brands');

dotenv.config();

const flatCategories = [
  { name: 'Gül Buketleri', slug: 'gul-buketleri', icon: '🌹', location: 'navbar', order: 1 },
  { name: 'Lüks Orkideler', slug: 'luks-orkideler', icon: '🌸', location: 'navbar', order: 2 },
  { name: 'Kutuda Çiçekler', slug: 'kutuda-cicekler', icon: '🎁', location: 'navbar', order: 3 },
  { name: 'Premium Seri', slug: 'premium-seri', icon: '💎', location: 'navbar', order: 4 },
  { name: 'Doğum Günü', slug: 'dogum-gunu', icon: '🎂', location: 'sidebar', order: 5 },
  { name: 'Yıldönümü', slug: 'yildonumu', icon: '💍', location: 'sidebar', order: 6 },
  { name: 'Yeni İş & Tebrik', slug: 'tebrik', icon: '🎉', location: 'sidebar', order: 7 },
  { name: 'Saksı Çiçekleri', slug: 'saksi-cicekleri', icon: '🪴', location: 'sidebar', order: 8 },
  { name: 'Ofis Bitkileri', slug: 'ofis-bitkileri', icon: '🌿', location: 'sidebar', order: 9 },
  { name: 'Hediyelikler', slug: 'hediyelikler', icon: '🧸', location: 'sidebar', order: 10 },
  { name: 'Mevsim Çiçekleri', slug: 'mevsim-icekleri', icon: '🌻', location: 'sidebar', order: 11 }
];

const products = [
  {
    name: 'Kızıl Aşk 50 Gül',
    price: 3450,
    discount: 10,
    category: 'Gül Buketleri',
    description: 'Aşkın en saf ve tutkulu hali. 50 adet premium ithal kırmızı gül ile hazırlanan bu görkemli buket, unutulmaz anlar için tasarlandı.',
    images: ['https://images.unsplash.com/photo-1548683311-e1c503ffb1c5?q=80&w=1200'],
    upsellOptions: [
      { name: 'Elite Cam Vazo', price: 250, imageUrl: 'https://images.unsplash.com/photo-1542176880-974d6c4e09f5?w=500&q=80' },
      { name: 'Godiva Çikolata', price: 450, imageUrl: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=500&q=80' }
    ]
  },
  {
    name: 'Beyaz Bulut Orkide',
    price: 1850,
    category: 'Lüks Orkideler',
    description: 'Zerafetin simgesi çift dallı beyaz orkide, özel tasarım seramik saksısı ile evinizin en asil köşesi olmaya aday.',
    images: ['https://images.unsplash.com/photo-1534885412334-dfcaaa936558?q=80&w=1200']
  },
  {
    name: 'Bahar Esintisi Mix',
    price: 1250,
    category: 'Mevsim Çiçekleri',
    description: 'Mevsimin en taze çiçeklerinden oluşan renkli ve neşeli bir aranjman. Gününüze enerji katmak için ideal.',
    images: ['https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1200']
  },
  {
    name: 'Vintage Pembe Güller',
    price: 1650,
    category: 'Gül Buketleri',
    description: 'Nostaljik ve romantik. 21 adet vintage pembe gülün zarif dokunuşu.',
    images: ['https://images.unsplash.com/photo-1496062031456-07b8f162a322?q=80&w=1200']
  },
  {
    name: 'Antoryum Elegance',
    price: 1100,
    category: 'Saksı Çiçekleri',
    description: 'Kalp şeklindeki yapraklarıyla aşkı ve misafirperverliği temsil eden Antoryum.',
    images: ['https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=1200']
  },
  {
    name: 'Midnight Blue Ortanca',
    price: 1400,
    category: 'Mevsim Çiçekleri',
    description: 'Derin mavi tonlarıyla büyüleyen, mevsimin en özel ortancaları.',
    images: ['https://images.unsplash.com/photo-1502444330242-7185dfd500f7?q=80&w=1200']
  },
  {
    name: 'Güneş Işığı Ayçiçeği',
    price: 950,
    category: 'Doğum Günü',
    description: 'Enerji ve mutluluk veren taze ayçiçekleri ile sevdiklerinizin gününü aydınlatın.',
    images: ['https://images.unsplash.com/photo-159742324403d-c1a5097a2d3a?q=80&w=1200']
  },
  {
    name: 'Premium Şampanya Gülleri',
    price: 2200,
    category: 'Premium Seri',
    description: 'Ender bulunan şampanya rengi ithal güllerle hazırlanan, lüksün tanımı bir buket.',
    images: ['https://images.unsplash.com/photo-1582228784033-90d989f66068?q=80&w=1200']
  },
  {
    name: 'Monstera Deliciosa',
    price: 850,
    category: 'Ofis Bitkileri',
    description: 'Modern mekanların vazgeçilmezi, devetabanı olarak da bilinen ikonik iç mekan bitkisi.',
    images: ['https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=1200']
  },
  {
    name: 'Zarif Beyaz Zambaklar',
    price: 1350,
    category: 'Yıldönümü',
    description: 'Saflığın ve asaletın simgesi kokulu beyaz zambaklar.',
    images: ['https://images.unsplash.com/photo-1517130103328-9366ca67411a?q=80&w=1200']
  },
  {
    name: 'Tropikal Cennet Kuşu',
    price: 1750,
    category: 'Ofis Bitkileri',
    description: 'Egzotik görünümüyle dikkat çeken, dayanıklı ve etkileyici bir ofis bitkisi.',
    images: ['https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1200']
  },
  {
    name: 'Lavanta Rüyası Buket',
    price: 900,
    category: 'Yeni İş & Tebrik',
    description: 'Huzur veren kokusuyla kurutulmuş ve taze lavantaların eşsiz uyumu.',
    images: ['https://images.unsplash.com/photo-1515549832467-8783363e1927?q=80&w=1200']
  },
  {
    name: 'Pachira Para Ağacı',
    price: 1200,
    category: 'Saksı Çiçekleri',
    description: 'Şans ve bereket getirdiğine inanılan, örgü gövdeli Pachira.',
    images: ['https://images.unsplash.com/photo-1509423350716-97f9360b4e5f?q=80&w=1200']
  },
  {
    name: 'Siyah Kutu 101 Gül',
    price: 6500,
    discount: 5,
    category: 'Premium Seri',
    description: 'Lüks kadife siyah kutuda 101 adet kusursuz kırmızı gül. Hayranlık uyandıracak bir hediye.',
    images: ['https://images.unsplash.com/photo-1561181286-d3efa7dcc18c?q=80&w=1200']
  },
  {
    name: 'Gökkuşağı Gülleri',
    price: 2800,
    category: 'Doğum Günü',
    description: 'Her biri farklı renklerde boyanmış canlı güllerle fantastik bir sürpriz.',
    images: ['https://images.unsplash.com/photo-1591880911020-f024058f967a?q=80&w=1200']
  },
  {
    name: 'Succulent Bahçesi',
    price: 750,
    category: 'Ofis Bitkileri',
    description: 'Modern beton saksıda 5 farklı tür sukulentten oluşan mini bahçe.',
    images: ['https://images.unsplash.com/photo-1509423350716-97f9360b4e5f?q=80&w=1200']
  },
  {
    name: 'Zarif Şakayık Buketi',
    price: 2400,
    category: 'Premium Seri',
    description: 'Mevsimin en kıymetli üyeleri pembe şakayıklar ile hazırlanan romantik tasarım.',
    images: ['https://images.unsplash.com/photo-1494336934272-f04639775437?q=80&w=1200']
  },
  {
    name: 'Barış Çiçeği Spatfillum',
    price: 1050,
    category: 'Yıldönümü',
    description: 'Huzur veren beyaz yelkenleri ve parlak yeşil yapraklarıyla her mekana uygun.',
    images: ['https://images.unsplash.com/photo-1592150621344-71261a86851b?q=80&w=1200']
  },
  {
    name: 'Mavi Solmayan Gül',
    price: 850,
    category: 'Yıldönümü',
    description: 'Özel tekniklerle 2 yıl tazeliğini koruyan cam fanusta mavi gül.',
    images: ['https://images.unsplash.com/photo-1533616688419-b7a585564566?q=80&w=1200']
  },
  {
    name: 'İtalyan Teraryum',
    price: 1950,
    category: 'Hediyelikler',
    description: 'Dev cam küre içerisinde el yapımı figürler ve canlı bitkilerle küçük bir dünya.',
    images: ['https://images.unsplash.com/photo-1509423350716-97f9360b4e5f?q=80&w=1200']
  }
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error('MONGODB_URI not found in environment');

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB...');

    // Clear existing
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Brand.deleteMany({});

    // Seed Brand
    const doreBrand = await Brand.create({
      name: 'Dore Adem Premium',
      description: 'Zerafetin ve lüks tasarımın İstanbul\'daki adresi.'
    });

    // Seed Categories
    const catMap = {};
    for (const cat of flatCategories) {
      const created = await Category.create(cat);
      catMap[cat.name] = created._id;
    }
    console.log('Categories seeded.');

    // Seed Products
    for (const p of products) {
      const categoryId = catMap[p.category];
      if (!categoryId) {
          console.warn(`Category not found for product: ${p.name}`);
          continue;
      }
      await Product.create({
        ...p,
        category: categoryId,
        brand: doreBrand._id,
        stock: Math.floor(Math.random() * 50) + 10,
        featured: Math.random() > 0.7
      });
    }
    console.log('Products seeded.');

    console.log('Comprehensive seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();
