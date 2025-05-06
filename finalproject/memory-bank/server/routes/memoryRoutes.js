const express = require('express');
const router = express.Router();
const memoryController = require('../controllers/memoryController');
const { authenticate } = require('../middleware/auth');

// Get user's memories route
router.get('/', authenticate, memoryController.getUserMemories);

// Create memory route
router.post('/', authenticate, memoryController.createMemory);

// Get specific memory route
router.get('/:id', authenticate, memoryController.getMemory);

// Update memory route
router.put('/:id', authenticate, memoryController.updateMemory);

// Delete memory route
router.delete('/:id', authenticate, memoryController.deleteMemory);

module.exports = router;
