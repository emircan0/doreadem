const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Routes
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const brandRoutes = require('./routes/brandRoutes');
const organizationRoutes = require('./routes/organizationRoutes');

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dore_adem';

console.log('--- DB CONFIG ---');
console.log('URI Prefix:', MONGODB_URI.startsWith('mongodb+srv') ? 'Atlas (mongodb+srv)' : 'Local (mongodb://)');
console.log('------------------');

// Middleware
app.use(cors()); // CORS middleware
app.use(express.json()); // JSON parsing
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.method !== 'GET') console.log('Body:', req.body);
  next();
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/products', productRoutes); 
app.use('/api/orders', orderRoutes); 
app.use('/api/users', userRoutes); 
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/organizations', organizationRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'Dosya boyutu çok büyük (Maksimum 5MB)' });
  }

  if (err.message === 'Yalnızca resim dosyalarına izin verilir.') {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({ 
    message: 'Bir sunucu hatası oluştu!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// MongoDB Connection & Server Start
const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // 5 saniye sonra timeout ver
    });
    console.log('--- DB CONNECTION ---');
    console.log('MongoDB bağlantısı başarılı');
    console.log('----------------------');

    // Server Start (Sadece DB bağlandıktan sonra)
    app.listen(PORT, () => {
      console.log(`Server http://localhost:${PORT} adresinde çalışıyor`);
    });
  } catch (err) {
    console.error('CRITICAL: MongoDB bağlantı hatası!');
    console.error('Hata Mesajı:', err.message);
    
    if (err.message.includes('ECONNREFUSED')) {
      console.log('\n' + '='.repeat(50));
      console.log('İPUCU: Yerel MongoDB (Docker) çalışmıyor olabilir.');
      console.log('Çözüm: "docker-compose up -d" komutunu çalıştırın.');
      console.log('='.repeat(50) + '\n');
    }
    
    // Uygulamayı durdur (Nodemon varsa tekrar deneyecektir)
    process.exit(1);
  }
};

startServer();


