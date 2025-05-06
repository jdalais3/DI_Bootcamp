const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

// Get current user route
router.get('/me', authenticate, userController.getCurrentUser);

// Update current user route
router.put('/me', authenticate, userController.updateCurrentUser);

// Get user's caregivers route
router.get('/:id/caregivers', authenticate, userController.getCaregivers);

// Get caregiver's patients route
router.get('/patients', authenticate, authorize('caregiver'), userController.getPatients);

// server/routes/userRoutes.js - Add this route
router.post('/connect-patient', authenticate, authorize('caregiver'), userController.connectWithPatient);

module.exports = router;
