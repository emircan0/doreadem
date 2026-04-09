const Brand = require('../models/Brands');

// Marka listeleme
const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: 'Markalar listelenirken hata oluştu.', error });
  }
};

// Yeni marka ekleme
const createBrand = async (req, res) => {
  const { name, description, logo, website, isActive } = req.body;

  try {
    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      return res.status(400).json({ message: 'Bu marka zaten mevcut.' });
    }

    const newBrand = new Brand({ 
      name, 
      description, 
      logo, 
      website, 
      isActive 
    });
    
    await newBrand.save();
    res.status(201).json(newBrand);
  } catch (error) {
    res.status(500).json({ message: 'Marka eklenirken hata oluştu.', error: error.message });
  }
};

// Marka güncelle
const updateBrand = async (req, res) => {
  const { id } = req.params;
  const { name, description, logo, website, isActive } = req.body;

  try {
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: 'Marka bulunamadı.' });
    }

    if (name && name !== brand.name) {
      const existing = await Brand.findOne({ name, _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({ message: 'Bu isimde bir marka zaten mevcut.' });
      }
    }

    brand.name = name || brand.name;
    brand.description = description !== undefined ? description : brand.description;
    brand.logo = logo !== undefined ? logo : brand.logo;
    brand.website = website !== undefined ? website : brand.website;
    brand.isActive = isActive !== undefined ? isActive : brand.isActive;

    await brand.save();
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Marka güncellenirken hata oluştu.', error: error.message });
  }
};

// Marka silme
const deleteBrand = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBrand = await Brand.findByIdAndDelete(id);
    if (!deletedBrand) {
      return res.status(404).json({ message: 'Marka bulunamadı.' });
    }

    res.status(200).json({ message: 'Marka silindi.' });
  } catch (error) {
    res.status(500).json({ message: 'Marka silinirken hata oluştu.', error });
  }
};

module.exports = { getBrands, createBrand, updateBrand, deleteBrand };
