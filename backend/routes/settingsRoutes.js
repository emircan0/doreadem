const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protectAdmin } = require('../middleware/adminAuthMiddleware');

// GET /api/settings — public (frontend kullanır)
router.get('/', getSettings);

// PUT /api/settings — admin
router.put('/', protectAdmin, updateSettings);

module.exports = router;
