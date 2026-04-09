const express = require('express');
const router = express.Router();
const {
    getCategories,
    createCategory,
    deleteCategory,
    updateUserProfile,
    getUserProfileId,
    deleteUser
} = require('../controllers/categoriesController');

// Kategoriler için API yolları
router.get('/', getCategories);
router.post('/', createCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
