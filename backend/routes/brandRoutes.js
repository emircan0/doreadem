const express = require('express');
const router = express.Router();
const { getBrands, createBrand, updateBrand, deleteBrand } = require('../controllers/brandsController');
const { protectAdmin } = require('../middleware/adminAuthMiddleware');

router.get('/', getBrands);
router.post('/', protectAdmin, createBrand);
router.put('/:id', protectAdmin, updateBrand);
router.delete('/:id', protectAdmin, deleteBrand);

module.exports = router;
