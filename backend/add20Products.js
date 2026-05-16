const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Categories');
const Product = require('./models/Product');
const Brand = require('./models/Brands');

dotenv.config();

const newProducts = [
  {
    name: 'Royal Papatya Bahçesi',
    price: 1150,
    discount: 5,
    categoryName: 'Mevsim Çiçekleri',
    description: 'En taze ve canlı papatyalardan oluşan bu geniş aranjman, baharın tüm coşkusunu evinize veya sevdiklerinize getiriyor. Saf sevginin en güzel ifadesi.',
    shortDescription: 'Taze papatyalarla hazırlanan görkemli aranjman.',
    images: ['https://images.unsplash.com/photo-1558293722-e42a98f12b6d?q=80&w=1200'],
    stock: 25,
    featured: true
  },
  {
    name: 'Kırmızı Güllerin Büyüsü 100 Adet',
    price: 6800,
    categoryName: 'Gül Buketleri',
    description: 'Büyük aşklar büyük jestler gerektirir. 100 adet ithal premium kırmızı gül ile hazırlanan bu devasa buket, görenleri büyüleyecek kalitede.',
    shortDescription: '100 adet ithal kırmızı gül buketi.',
    images: ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200'],
    stock: 10,
    featured: true
  },
  {
    name: 'Mor Menekşe Rüyası',
    price: 650,
    categoryName: 'Saksı Çiçekleri',
    description: 'Şık ve zarif seramik saksıda sunulan mor menekşeler, masanızın veya pencerenizin en tatlı misafiri olacak. Uzun ömürlü ve bakımı kolay.',
    shortDescription: 'Seramik saksıda canlı mor menekşe.',
    images: ['https://images.unsplash.com/photo-1596766442656-bba097ef2c70?q=80&w=1200'],
    stock: 30,
    featured: false
  },
  {
    name: 'Beyaz Karanfil Zarafeti',
    price: 850,
    categoryName: 'Mevsim Çiçekleri',
    description: 'Masumiyetin ve asaletin sembolü olan beyaz karanfiller, özel tasarım ambalajı ile sunuluyor. Hem tebrik hem de özür için harika bir seçenek.',
    shortDescription: 'Saf ve zarif beyaz karanfil buketi.',
    images: ['https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=1200'],
    stock: 40,
    featured: false
  },
  {
    name: 'Egzotik Flamingo Çiçeği',
    price: 1450,
    categoryName: 'Saksı Çiçekleri',
    description: 'Pembe renkli dev Antoryum nam-ı diğer Flamingo Çiçeği. Ev ve ofislere tropikal bir hava katmak için mükemmel bir tercih.',
    shortDescription: 'Tropikal pembe Antoryum bitkisi.',
    images: ['https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=1200'],
    stock: 15,
    featured: true
  },
  {
    name: 'Gala Çiçeği Güzelliği',
    price: 1950,
    categoryName: 'Lüks Orkideler', 
    description: 'Sıradışı güzelliğiyle bilinen Gala çiçekleri (Calla Lily), minimalist ve modern bir vazoda şıklığı doruklara taşıyor.',
    shortDescription: 'Vazoda beyaz Gala çiçekleri tasarımı.',
    images: ['https://images.unsplash.com/photo-1582228784033-90d989f66068?q=80&w=1200'],
    stock: 12,
    featured: false
  },
  {
    name: 'Pembe Şakayık Seremonisi',
    price: 2600,
    discount: 15,
    categoryName: 'Premium Seri',
    description: 'Güzelliğiyle baş döndüren iri pembe şakayıklar. Bahar ve yaz aylarının vazgeçilmezi olan bu buketle sevdiklerinizi şımartın.',
    shortDescription: 'İri çiçekli premium pembe şakayık buketi.',
    images: ['https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=1200'],
    stock: 8,
    featured: true
  },
  {
    name: 'Mavi Ortanca Deniz',
    price: 1650,
    categoryName: 'Mevsim Çiçekleri',
    description: 'Sakinliğin ve huzurun rengi mavi ortancalar, gösterişli ve dolgun yapısıyla mükemmel bir hediye seçeneği sunuyor.',
    shortDescription: 'Gösterişli mavi ortanca aranjmanı.',
    images: ['https://images.unsplash.com/photo-1549428581-2292fde1e544?q=80&w=1200'],
    stock: 20,
    featured: false
  },
  {
    name: 'Gül ve Lilyum Ahengi',
    price: 2100,
    categoryName: 'Kutuda Çiçekler',
    description: 'Kırmızı güllerin tutkusu ile beyaz lilyumların zarafeti tek bir şık kutuda buluşuyor. Mis kokusuyla etrafı büyüleyen bir tasarım.',
    shortDescription: 'Kırmızı gül ve beyaz lilyum kutu tasarımı.',
    images: ['https://images.unsplash.com/photo-1581079361730-804d9a69ed1e?q=80&w=1200'],
    stock: 18,
    featured: true
  },
  {
    name: 'Güneşin Kalbi Ayçiçeği Kutusu',
    price: 1350,
    categoryName: 'Kutuda Çiçekler',
    description: 'Enerji dolu sarı ayçiçekleri, özel tasarım siyah kutusunda sıcak bir tebessüm yaratmak için bekliyor.',
    shortDescription: 'Özel kutuda sıcak ve samimi ayçiçekleri.',
    images: ['https://images.unsplash.com/photo-1520302630592-fac07ece9f1c?q=80&w=1200'],
    stock: 22,
    featured: false
  },
  {
    name: 'Zarif Çizgili Dua Çiçeği (Calathea)',
    price: 950,
    categoryName: 'Ofis Bitkileri',
    description: 'Yapraklarındaki eşsiz desenlerle dikkat çeken Calathea. Havası temizleyen ve bulunduğu ortama farklılık katan dekoratif bir bitki.',
    shortDescription: 'Dekoratif yapraklı Calathea (Dua Çiçeği).',
    images: ['https://images.unsplash.com/photo-1610450947087-dc9672626e2e?q=80&w=1200'],
    stock: 14,
    featured: false
  },
  {
    name: 'Bonsai Ficus Ginseng',
    price: 1850,
    discount: 10,
    categoryName: 'Saksı Çiçekleri',
    description: 'Asya kültürünün derinliğini taşıyan özel gövdeli Bonsai ağacı. Hem ofis masaları hem de ev dekorasyonu için prestijli bir hediye.',
    shortDescription: 'Prestijli ve şık Bonsai ağacı tasarımı.',
    images: ['https://images.unsplash.com/photo-1599598425947-330026210815?q=80&w=1200'],
    stock: 12,
    featured: true
  },
  {
    name: 'Turuncu Lale Baharı',
    price: 1750,
    categoryName: 'Gül Buketleri', // Güllerle kombin olabilir veya genel buket
    description: 'Baharın enerjisini yansıtan parlak turuncu laleler. Zarif ve modern görünümüyle her ortama neşe katar.',
    shortDescription: 'Taptaze ve parlak turuncu laleler.',
    images: ['https://images.unsplash.com/photo-1582228800921-2f31d0411d9f?q=80&w=1200'],
    stock: 35,
    featured: false
  },
  {
    name: 'Mini Kaktüs Koleksiyonu',
    price: 780,
    categoryName: 'Ofis Bitkileri',
    description: 'Özel beton saksıda tasarlanmış, bakımı son derece kolay 3 farklı mini kaktüs aranjmanı. Bilgisayar masaları için ideal.',
    shortDescription: 'Beton saksıda bakımı kolay kaktüs aranjmanı.',
    images: ['https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d?q=80&w=1200'],
    stock: 45,
    featured: false
  },
  {
    name: 'Şefkatli Kasımpatı Sepeti',
    price: 1200,
    categoryName: 'Mevsim Çiçekleri',
    description: 'Rengarenk kasımpatıların hasır sepet içindeki uyumu. Kır bahçelerinin doğallığını evinize getiriyoruz.',
    shortDescription: 'Hasır sepette doğal kasımpatı aranjmanı.',
    images: ['https://images.unsplash.com/photo-1507705177893-bc423d2427a7?q=80&w=1200'],
    stock: 16,
    featured: false
  },
  {
    name: 'Beyaz Orkide ve Güller',
    price: 3200,
    categoryName: 'Lüks Orkideler',
    description: 'Asaletin temsili çift dallı Phalaenopsis beyaz orkide ve taze kesim beyaz güllerin özel vazodaki muhteşem birleşimi.',
    shortDescription: 'Orkide ve güllerin lüks vazo aranjmanı.',
    images: ['https://images.unsplash.com/photo-1528699635560-15609ee364f8?q=80&w=1200'],
    stock: 7,
    featured: true
  },
  {
    name: 'Tutkulu Bordo Güller 41 Adet',
    price: 3100,
    categoryName: 'Gül Buketleri',
    description: 'Sıradışı bir aşk için sıradışı bir renk. Siyah ambalajda sunulan 41 adet derin bordo gül, gizemli ve etkileyici bir hediye.',
    shortDescription: 'Siyah ambalajda 41 adet ithal bordo gül.',
    images: ['https://images.unsplash.com/photo-1555541604-db5f8f8ed974?q=80&w=1200'],
    stock: 11,
    featured: true
  },
  {
    name: 'Pembe Gül Kutusu',
    price: 1800,
    categoryName: 'Kutuda Çiçekler',
    description: 'Tatlılığın ve şefkatin rengi pembe güller, kadife dokulu yuvarlak lüks kutuda özenle dizildi.',
    shortDescription: 'Kadife kutuda romantik pembe güller.',
    images: ['https://images.unsplash.com/photo-1583327171620-ca4803739b7c?q=80&w=1200'],
    stock: 24,
    featured: false
  },
  {
    name: 'Aloe Vera Şifası',
    price: 550,
    categoryName: 'Ofis Bitkileri',
    description: 'Hem havayı temizleyen hem de doğal şifa kaynağı olan Aloe Vera bitkisi, şık toprak saksısında sizlerle.',
    shortDescription: 'Toprak saksıda sağlıklı Aloe Vera bitkisi.',
    images: ['https://images.unsplash.com/photo-1554631221-196b02660235?q=80&w=1200'],
    stock: 50,
    featured: false
  },
  {
    name: 'Romantik Ay Işığı Aranjmanı',
    price: 4500,
    discount: 20,
    categoryName: 'Premium Seri',
    description: 'Beyaz, krem ve uçuk pembe tonlarındaki en nadide ithal çiçeklerden oluşan, geceyi aydınlatan devasa bir lüks aranjman.',
    shortDescription: 'Soft tonlarda dev lüks çiçek aranjmanı.',
    images: ['https://images.unsplash.com/photo-1560361048-c9fbab7c1dc2?q=80&w=1200'],
    stock: 5,
    featured: true
  }
];

const seedNewProducts = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.log("No MONGODB_URI in process.env, trying to load from .env file");
        // dotenv already loaded above
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    // Get Brand
    let brand = await Brand.findOne({ name: 'Dore Adem Premium' });
    if (!brand) {
        brand = await Brand.findOne(); // just get any brand
    }
    if (!brand) {
        brand = await Brand.create({
            name: 'Dore Adem Premium',
            description: 'Premium Çiçek Markası'
        });
    }

    // Get Categories
    const categories = await Category.find({});
    
    let addedCount = 0;

    for (const p of newProducts) {
      // Find category by name or fallback to the first one available
      let cat = categories.find(c => c.name === p.categoryName);
      if (!cat && categories.length > 0) {
          cat = categories[0];
      }

      if (!cat) {
          console.log(`Could not find any categories to link to product ${p.name}`);
          continue;
      }

      await Product.create({
        name: p.name,
        price: p.price,
        discount: p.discount || 0,
        description: p.description,
        shortDescription: p.shortDescription,
        categories: [cat._id],
        brand: brand._id,
        images: p.images,
        stock: p.stock,
        featured: p.featured,
        status: 'active'
      });
      addedCount++;
    }

    console.log(`Successfully added ${addedCount} new products!`);
    process.exit(0);
  } catch (err) {
    console.error('Error adding products:', err);
    process.exit(1);
  }
};

seedNewProducts();
