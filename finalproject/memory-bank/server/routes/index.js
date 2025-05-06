const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const memoryRoutes = require('./memoryRoutes');
const searchRoutes = require('./searchRoutes');
const tagRoutes = require('./tagRoutes');
const uploadRoutes = require('./uploadRoutes');

// Register routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/memories', memoryRoutes);
router.use('/search', searchRoutes);
router.use('/tags', tagRoutes);
router.use('/uploads', uploadRoutes);

module.exports = router;
