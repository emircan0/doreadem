const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  uploadImages
} = require('../controllers/productController');

const { storage } = require('../config/cloudinary');

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.mimetype);
  if (extname && mimeOk) cb(null, true);
  else cb(new Error('Yalnızca resim dosyalarına izin verilir.'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// Routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Image upload only (returns URLs)
router.post('/upload', upload.array('images', 10), uploadImages);

// Product CRUD with optional image upload
router.post('/', upload.array('images', 10), createProduct);
router.put('/:id', upload.array('images', 10), updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
