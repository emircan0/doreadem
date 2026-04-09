const express = require('express');
const router = express.Router();
const brandsController = require('../controllers/brandsController');

// Markalar için API yolları
router.get('/', brandsController.getBrands);
router.post('/', brandsController.createBrand);
router.delete('/:id', brandsController.deleteBrand);

module.exports = router;
