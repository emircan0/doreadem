const Category = require('../models/Categories');

// Kategori listeleme
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Kategori listelenirken hata oluştu.', error });
  }
};

// Yeni kategori ekleme
const createCategory = async (req, res) => {
  const { name, description, image, icon, location, parentCategory, isFeatured, order } = req.body;

  try {
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Bu kategori zaten mevcut.' });
    }

    const newCategory = new Category({ 
      name, 
      description, 
      image, 
      icon, 
      location,
      parentCategory, 
      isFeatured, 
      order 
    });
    
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Kategori eklenirken hata oluştu.', error: error.message });
  }
};

// Kategori güncelle
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description, image, icon, location, parentCategory, isFeatured, order } = req.body;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı.' });
    }

    // Aynı isimle başka kategori varsa engelle
    if (name && name !== category.name) {
      const existing = await Category.findOne({ name, _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({ message: 'Bu isimde bir kategori zaten mevcut.' });
      }
    }

    category.name = name || category.name;
    category.description = description !== undefined ? description : category.description;
    category.image = image !== undefined ? image : category.image;
    category.icon = icon !== undefined ? icon : category.icon;
    category.location = location !== undefined ? location : category.location;
    category.parentCategory = parentCategory !== undefined ? parentCategory : category.parentCategory;
    category.isFeatured = isFeatured !== undefined ? isFeatured : category.isFeatured;
    category.order = order !== undefined ? order : category.order;

    await category.save();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Kategori güncellenirken hata oluştu.', error: error.message });
  }
};

// Kategori silme
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Kategori bulunamadı.' });
    }

    res.status(200).json({ message: 'Kategori silindi.' });
  } catch (error) {
    res.status(500).json({ message: 'Kategori silinirken hata oluştu.', error });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
