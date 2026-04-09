import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
  siteName: 'Dore Adem',
  siteTagline: 'Elegance in Every Detail',
  announcement: 'Özel Koleksiyonlarda %20 İndirim | Ücretsiz Kargo',
  announcementEnabled: true,
  freeShippingThreshold: 2000,
  heroSlides: [
    {
      _id: '1',
      title: 'Yeni Sezon Koleksiyonu',
      subtitle: 'Zamansız şıklığın yeni yorumu — özenle tasarlandı.',
      imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2669&auto=format&fit=crop',
      ctaText: 'Koleksiyonu Keşfet',
      ctaLink: '/kategori/yeni-sezon',
      overlay: 40,
    },
    {
      _id: '2',
      title: 'İmza Koleksiyon',
      subtitle: 'Her detayda ustalık, her dikişte bir hikaye.',
      imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=2670&auto=format&fit=crop',
      ctaText: 'Alışverişe Başla',
      ctaLink: '/kategori/imza-koleksiyonu',
      overlay: 35,
    },
  ],
  contactEmail: '',
  contactPhone: '',
  address: '',
  socialMedia: { instagram: '#', facebook: '#', pinterest: '#', tiktok: '#', twitter: '#' },
  footerText: '',
  aboutTitle: 'Hikayemiz',
  aboutSubtitle: 'Her çantada bir sanatçının emeği, her dikişte bir tutku saklı.',
  stats: [
    { label: 'El Yapımı Ürün', value: '500+' },
    { label: 'Yıllık Deneyim', value: '12' },
    { label: 'Mutlu Müşteri', value: '10K+' }
  ],
  shippingMethods: [],
  paymentMethods: {
    bankTransfer: { enabled: true, details: '' },
    creditCard: { enabled: false, provider: 'iyzico', apiKey: '', secretKey: '', baseUrl: 'https://sandbox-api.iyzipay.com' }
  }
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${config.API_URL}/settings`)
      .then((res) => setSettings({ ...DEFAULT_SETTINGS, ...res.data }))
      .catch(() => { /* fallback to defaults */ })
      .finally(() => setLoading(false));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
};
