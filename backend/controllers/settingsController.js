const Settings = require('../models/Settings');

const defaultSlides = [
  {
    title: 'Yeni Sezon Koleksiyonu',
    subtitle: 'Zamansız şıklığın yeni yorumu — özenle tasarlandı.',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2669&auto=format&fit=crop',
    ctaText: 'Koleksiyonu Keşfet',
    ctaLink: '/kategori/yeni-sezon',
    textColor: 'white',
    overlay: 40,
  },
  {
    title: 'İmza Koleksiyon',
    subtitle: 'Her detayda ustalık, her dikişte bir hikaye.',
    imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=2670&auto=format&fit=crop',
    ctaText: 'Alışverişe Başla',
    ctaLink: '/kategori/imza-koleksiyonu',
    textColor: 'white',
    overlay: 35,
  },
  {
    title: 'Seyahat Koleksiyonu',
    subtitle: 'Yolculuklarınızı zarif kılacak eşsiz tasarımlar.',
    imageUrl: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=2574&auto=format&fit=crop',
    ctaText: 'Şimdi Keşfet',
    ctaLink: '/kategori/seyahat',
    textColor: 'white',
    overlay: 45,
  },
];

// GET /api/settings — public
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ heroSlides: defaultSlides });
    }
    res.json(settings);
  } catch (err) {
    console.error('Settings fetch error:', err);
    res.status(500).json({ message: 'Ayarlar yüklenemedi.' });
  }
};

// PUT /api/settings — admin only
const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    settings.updatedAt = new Date();
    await settings.save();
    res.json({ message: 'Ayarlar güncellendi.', settings });
  } catch (err) {
    console.error('Settings update error:', err);
    res.status(500).json({ message: 'Ayarlar güncellenemedi.' });
  }
};

module.exports = { getSettings, updateSettings };
