const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const { authenticate } = require('../middleware/auth');

// Get all tags route
router.get('/', authenticate, tagController.getAllTags);

module.exports = router;
