const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { authenticate } = require('../middleware/auth');

// Search memories route
router.get('/memories', authenticate, searchController.searchMemories);

module.exports = router;
