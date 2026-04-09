const express = require('express');
const router = express.Router();
const { getBrands, createBrand, updateBrand, deleteBrand } = require('../controllers/brandsController');

router.get('/', getBrands);
router.post('/', createBrand);
router.put('/:id', updateBrand);
router.delete('/:id', deleteBrand);

module.exports = router;
