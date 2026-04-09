const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');

// Routes
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const categoriesRouter = require('./routes/categoriesRoutes');
const brandsRouter = require('./routes/brandsRoutes');

// Environment Variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// CORS Options
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173'], // React uygulamanızın adresleri
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // İzin verilen HTTP metodları
  credentials: true, // Cookie gönderimi için izin
  allowedHeaders: ['Content-Type', 'Authorization'], // İzin verilen başlıklar
};

// Middleware
app.use(cors(corsOptions)); // CORS middleware
app.use(express.json()); // JSON verilerini alabilmek için middleware
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Uploads dizinini statik olarak sunuyoruz

// Multer setup: Görsellerin kaydedileceği klasör ve dosya ismi ayarı
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Görselleri 'uploads' klasörüne kaydedecek
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Dosya ismini benzersiz yapmak için zaman damgası ekliyoruz
  }
});

const upload = multer({ storage });

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch((err) => {
    console.error('MongoDB bağlantı hatası:', err);
    process.exit(1); // Bağlantı hatası durumunda uygulamayı durdur
  });

// Routes
app.use('/api/products', productRoutes); // Ürünlerle ilgili işlemler
app.use('/api/orders', orderRoutes); // Siparişlerle ilgili işlemler
app.use('/api/users', userRoutes); // Kullanıcılarla ilgili işlemler
app.use('/api/categories', categoriesRouter);
app.use('/api/brands', brandsRouter);

// Ürün resim yükleme API'si
app.post('/api/products/upload', (req, res) => {
  upload.array('images', 10)(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        console.error('Multer hata:', err);
        return res.status(400).json({ message: `Multer hata: ${err.message}` });
      } else {
        console.error('Beklenmedik bir hata:', err);
        return res.status(500).json({ message: 'Dosya yüklenirken beklenmedik bir hata oluştu.' });
      }
    }

    if (!req.files || req.files.length === 0) {
      console.error('Yüklenen dosya yok');
      return res.status(400).json({ message: 'Görsel yüklenmedi.' });
    }

    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    console.log('Yüklenen resimler:', imageUrls);
    res.status(200).json({ urls: imageUrls }); // Resimlerin URL'lerini döndürüyoruz
  });
});

// Test route (Root)
app.get('/', (req, res) => {
  res.send('API çalışıyor');
});

// Genel Hata Handling Middleware (Genel hata yönetimi)
app.use((err, req, res, next) => {
  console.error('Genel Hata:', err.stack); // Hata detaylarını logluyoruz
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ message: 'Sunucu hatası, lütfen tekrar deneyin.' });
});

// Server Start
app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT} adresinde çalışıyor`);
});
