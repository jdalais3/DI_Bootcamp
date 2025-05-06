const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { sequelize } = require('./models');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', routes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Error handling middleware
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);

// Set up Socket.io
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Socket auth middleware
  socket.on('authenticate', async (token) => {
    try {
      const { verifyToken } = require('./utils/jwt');
      const decoded = verifyToken(token);
      socket.userId = decoded.id;
      socket.join(`user-${decoded.id}`);
      
      // If user is a caregiver, join rooms for all patients
      if (decoded.role === 'caregiver') {
        const { User, CaregiverPatient } = require('./models');
        const patients = await User.findAll({
          include: [{
            model: CaregiverPatient,
            where: { caregiver_id: decoded.id }
          }]
        });
        
        patients.forEach(patient => {
          socket.join(`patient-${patient.id}`);
        });
      }
      
      socket.emit('authenticated');
    } catch (error) {
      socket.emit('authentication_error', 'Invalid token');
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Export for testing
module.exports = { app, server, io };

// Start server
if (require.main === module) {
  // Sync database and start server
  sequelize.sync({ alter: process.env.NODE_ENV === 'development' })
    .then(() => {
      server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
}