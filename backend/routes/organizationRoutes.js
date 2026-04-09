const express = require('express');
const router = express.Router();
const { 
    getOrganizations, 
    getOrganizationBySlug, 
    createOrganization, 
    updateOrganization, 
    deleteOrganization 
} = require('../controllers/organizationController');

// Public routes
router.get('/', getOrganizations);
router.get('/:slug', getOrganizationBySlug);

// Admin routes (In a real app, add auth middleware here)
router.post('/', createOrganization);
router.put('/:id', updateOrganization);
router.delete('/:id', deleteOrganization);

module.exports = router;
