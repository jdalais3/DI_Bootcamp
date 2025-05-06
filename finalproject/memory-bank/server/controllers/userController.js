const { User, CaregiverPatient } = require('../models');

// Get current user profile
const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash'] }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Update current user profile
const updateCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name } = req.body;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update user
    await user.update({
      first_name,
      last_name
    });
    
    res.json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user's caregivers (for patients)
const getCaregivers = async (req, res, next) => {
  try {
    const userId = req.params.id;
    
    // Check if requesting user has permission
    if (req.user.id !== parseInt(userId) && req.user.role !== 'caregiver') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
    
    const caregiverConnections = await CaregiverPatient.findAll({
      where: { patient_id: userId },
      include: [{
        model: User,
        as: 'Caregiver',
        attributes: ['id', 'email', 'first_name', 'last_name', 'role']
      }]
    });
    
    const caregivers = caregiverConnections.map(connection => connection.Caregiver);
    
    res.json(caregivers);
  } catch (error) {
    next(error);
  }
};

// Get patients for caregiver
const getPatients = async (req, res, next) => {
  try {
    const caregiverId = req.user.id;
    
    // Only caregivers can access this endpoint
    if (req.user.role !== 'caregiver') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
    
    const patientConnections = await CaregiverPatient.findAll({
      where: { caregiver_id: caregiverId },
      include: [{
        model: User,
        as: 'Patient',
        attributes: ['id', 'email', 'first_name', 'last_name', 'role']
      }]
    });
    
    const patients = patientConnections.map(connection => ({
      ...connection.Patient.toJSON(),
      access_level: connection.access_level
    }));
    
    res.json(patients);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCurrentUser,
  updateCurrentUser,
  getCaregivers,
  getPatients
};
// server/controllers/userController.js - Add this method

// Connect with a patient (for caregivers)
const connectWithPatient = async (req, res, next) => {
  try {
    const caregiverId = req.user.id;
    const { patientEmail } = req.body;
    
    // Only caregivers can connect with patients
    if (req.user.role !== 'caregiver') {
      return res.status(403).json({ error: 'Only caregivers can use this feature' });
    }
    
    // Find the patient by email
    const patient = await User.findOne({ 
      where: { 
        email: patientEmail,
        role: 'patient'
      } 
    });
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    // Check if already connected
    const existingConnection = await CaregiverPatient.findOne({
      where: {
        caregiver_id: caregiverId,
        patient_id: patient.id
      }
    });
    
    if (existingConnection) {
      return res.status(409).json({ error: 'Already connected with this patient' });
    }
    
    // Create connection
    await CaregiverPatient.create({
      caregiver_id: caregiverId,
      patient_id: patient.id,
      access_level: 'basic' // Default access level
    });
    
    res.status(201).json({ 
      message: 'Connection created successfully',
      patient: {
        id: patient.id,
        first_name: patient.first_name,
        last_name: patient.last_name,
        email: patient.email
      }
    });
  } catch (error) {
    next(error);
  }
};

// Add to module.exports
module.exports = {
  getCurrentUser,
  updateCurrentUser,
  getCaregivers,
  getPatients,
  connectWithPatient  // Add this line
};