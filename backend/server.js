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

// MongoDB Connection
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    await mongoose.connect(MONGODB_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('--- DB CONNECTION ---');
    console.log('MongoDB bağlantısı başarılı');
    console.log('----------------------');
  } catch (err) {
    console.error('CRITICAL: MongoDB bağlantı hatası!', err.message);
  }
};

const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS origin not allowed'));
  }
}));
app.use(express.json({ limit: '1mb' }));
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Vercel serverless ortamında veritabanı bağlantısını her istekte kontrol et
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});


// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Dore Adem API Vercel üzerinde çalışıyor!', status: 'OK' });
});

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

  if (err.message === 'CORS origin not allowed') {
    return res.status(403).json({ message: 'Bu origin için erişim izni yok' });
  }

  res.status(500).json({ 
    message: 'Bir sunucu hatası oluştu!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Sadece yerel geliştirmede (Vercel dışında) port dinle
if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server http://localhost:${PORT} adresinde çalışıyor`);
  });
}

module.exports = app;


