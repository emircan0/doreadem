const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');

// GET /api/settings — public (frontend kullanır)
router.get('/', getSettings);

// PUT /api/settings — admin
router.put('/', updateSettings);

module.exports = router;
