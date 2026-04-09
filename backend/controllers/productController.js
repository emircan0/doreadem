const Product = require('../models/Product');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// Dosya yükleme ayarları
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Geçersiz dosya türü'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
}).array('images', 10);

// Tüm ürünleri getir (Filtreleme ve Sıralama desteğiyle)
const getProducts = async (req, res) => {
    try {
        const { category, sort } = req.query;
        let query = {};

        // Kategoriye göre filtrele (Slug üzerinden)
        if (category && category !== 'tumu') {
            const Category = require('../models/Categories');
            const foundCategory = await Category.findOne({ slug: category });
            if (foundCategory) {
                query.categories = foundCategory._id;
            }
        }

        // Sıralama mantığı
        let sortOption = { createdAt: -1 }; // Varsayılan: En Yeniler
        if (sort === 'price_asc') sortOption = { price: 1 };
        if (sort === 'price_desc') sortOption = { price: -1 };
        if (sort === 'newest') sortOption = { createdAt: -1 };

        const products = await Product.find(query)
            .populate('categories', 'name slug icon')
            .populate('brand', 'name slug logo')
            .sort(sortOption);
            
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Ürünler getirilirken hata oluştu', error: error.message });
    }
};

// ID veya Slug'a göre ürün getir
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findOne({
            $or: [
                { _id: mongoose.Types.ObjectId.isValid(id) ? id : null },
                { slug: id }
            ].filter(Boolean)
        })
        .populate('categories')
        .populate('brand');

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Ürün bulunamadı' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Ürün getirilirken hata oluştu', error: error.message });
    }
};

// Upload endpoint (sadece resim yükler, ürün kaydetmez)
const uploadImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Dosya yüklenmedi' });
        }
        const urls = req.files.map(file => `/uploads/${file.filename}`);
        res.json({ urls });
    } catch (error) {
        res.status(500).json({ message: 'Resim yüklenirken hata oluştu', error: error.message });
    }
};

// Ürün oluştur
const createProduct = async (req, res) => {
    try {
        const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
        
        // Parse existingImages if provided
        let existingImages = [];
        if (req.body.existingImages) {
            try {
                existingImages = JSON.parse(req.body.existingImages);
            } catch(e) {}
        }
        
        const allImages = [...existingImages, ...imagePaths];

        console.log('--- REQ BODY ---', req.body);
        const product = new Product({
            name: req.body.name,
            description: req.body.description || '',
            price: +req.body.price,
            categories: req.body.categories ? (Array.isArray(req.body.categories) ? req.body.categories : [req.body.categories]) : [req.body.category],
            brand: req.body.brand,
            stock: +req.body.stock || 0,
            images: allImages,
            discount: +req.body.discount || 0,
            sku: req.body.sku || undefined,
            dimensions: {
                width: +(req.body['dimensions[width]'] || req.body.dimensions?.width) || 0,
                height: +(req.body['dimensions[height]'] || req.body.dimensions?.height) || 0,
                depth: +(req.body['dimensions[depth]'] || req.body.dimensions?.depth) || 0,
            },
            weight: { value: +req.body.weight || 0 },
            status: req.body.status || 'active',
            featured: req.body.featured === 'true',
        });
        console.log('--- FINAL PRODUCT OBJ ---', product);

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error('Ürün oluşturulurken hata:', error.message);
        res.status(400).json({ message: 'Ürün oluşturulurken hata oluştu', error: error.message });
    }
};

// Ürün güncelle
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Ürün bulunamadı' });
        }

        // Handle new uploaded files
        const newImagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
        
        // Handle existing images sent from frontend
        let existingImages = [];
        if (req.body.existingImages) {
            try {
                existingImages = JSON.parse(req.body.existingImages);
                // Normalize: strip server URL prefix if present (any domain)
                existingImages = existingImages.map(url => {
                    const uploadIndex = url.indexOf('/uploads/');
                    if (uploadIndex !== -1) {
                        return url.substring(uploadIndex);
                    }
                    return url;
                });
            } catch(e) {}
        }
        
        // Combine: existing kept images + newly uploaded
        const allImages = [...existingImages, ...newImagePaths];

        console.log('--- UPDATE REQ BODY ---', req.body);
        console.log('--- UPDATE REQ BODY ---', req.body);
        product.name = req.body.name || product.name;
        product.description = req.body.description !== undefined ? req.body.description : product.description;
        product.price = req.body.price !== undefined ? +req.body.price : product.price;
        
        if (req.body.categories) {
            product.categories = Array.isArray(req.body.categories) ? req.body.categories : [req.body.categories];
        } else if (req.body.category) {
            product.categories = [req.body.category];
        }

        product.brand = req.body.brand || product.brand;
        product.stock = req.body.stock !== undefined ? +req.body.stock : product.stock;
        product.discount = req.body.discount !== undefined ? +req.body.discount : product.discount;
        product.sku = req.body.sku !== undefined ? req.body.sku : product.sku;
        product.status = req.body.status || product.status;
        product.featured = req.body.featured !== undefined ? req.body.featured === 'true' : product.featured;
        console.log('--- UPDATING PRODUCT ---', product._id);
        console.log('--- UPDATING PRODUCT ---', product._id);
        
        if (req.body['dimensions[width]'] !== undefined || req.body.dimensions?.width !== undefined) {
            product.dimensions = {
                width: +(req.body['dimensions[width]'] || req.body.dimensions?.width) || 0,
                height: +(req.body['dimensions[height]'] || req.body.dimensions?.height) || 0,
                depth: +(req.body['dimensions[depth]'] || req.body.dimensions?.depth) || 0,
            };
        }
        
        if (req.body.weight !== undefined) {
            product.weight = { value: +req.body.weight || 0 };
        }

        // Only update images if something changed
        if (allImages.length > 0 || req.body.existingImages !== undefined) {
            product.images = allImages;
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        console.error('Ürün güncellenirken hata:', error.message);
        res.status(400).json({ message: 'Ürün güncellenirken hata oluştu', error: error.message });
    }
};

// Ürün sil
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await Product.deleteOne({ _id: req.params.id });
            res.json({ message: 'Ürün silindi' });
        } else {
            res.status(404).json({ message: 'Ürün bulunamadı' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Ürün silinirken hata oluştu', error: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImages,
    upload
};
