const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { authenticate } = require('../middleware/auth');

// File upload route
router.post('/', authenticate, uploadController.upload, uploadController.handleUpload);

module.exports = router;
