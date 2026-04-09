const mongoose = require('mongoose');

const heroSlideSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  ctaText: { type: String, default: 'Keşfet' },
  ctaLink: { type: String, default: '/kategori/tumu' },
  textColor: { type: String, default: 'white' },
  overlay: { type: Number, default: 40 },
}, { _id: true });

const settingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Dore Adem' },
  siteTagline: { type: String, default: 'Elegance in Every Detail' },
  siteDescription: { type: String, default: '' },
  logoUrl: { type: String, default: '' },
  announcement: { type: String, default: 'Özel Koleksiyonlarda %20 İndirim | Ücretsiz Kargo' },
  announcementEnabled: { type: Boolean, default: true },
  freeShippingThreshold: { type: Number, default: 2000 },
  heroSlides: [heroSlideSchema],
  contactEmail: { type: String, default: '' },
  contactPhone: { type: String, default: '' },
  address: { type: String, default: '' },
  socialMedia: {
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    pinterest: { type: String, default: '' },
    tiktok: { type: String, default: '' },
    twitter: { type: String, default: '' },
  },
  footerText: { type: String, default: '' },
  primaryColor: { type: String, default: '#c9a227' },
  aboutTitle: { type: String, default: 'Hikayemiz' },
  aboutSubtitle: { type: String, default: 'Her çantada bir sanatçının emeği, her dikişte bir tutku saklı.' },
  stats: [
    {
      label: { type: String, default: '' },
      value: { type: String, default: '' }
    }
  ],
  shippingMethods: [
    {
      name: { type: String, required: true },
      price: { type: Number, default: 0 },
      description: { type: String },
      freeAbove: { type: Number }
    }
  ],
  paymentMethods: {
    bankTransfer: {
      enabled: { type: Boolean, default: true },
      details: { type: String, default: '' }
    },
    creditCard: {
      enabled: { type: Boolean, default: false },
      provider: { type: String, default: 'iyzico' },
      apiKey: { type: String, default: '' },
      secretKey: { type: String, default: '' },
      baseUrl: { type: String, default: 'https://sandbox-api.iyzipay.com' }
    }
  },
  metaKeywords: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
