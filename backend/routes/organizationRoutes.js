const express = require('express');
const router = express.Router();
const { 
    getOrganizations, 
    getOrganizationBySlug, 
    createOrganization, 
    updateOrganization, 
    deleteOrganization 
} = require('../controllers/organizationController');
const { protectAdmin } = require('../middleware/adminAuthMiddleware');

// Public routes
router.get('/', getOrganizations);
router.get('/:slug', getOrganizationBySlug);

router.post('/', protectAdmin, createOrganization);
router.put('/:id', protectAdmin, updateOrganization);
router.delete('/:id', protectAdmin, deleteOrganization);

module.exports = router;
