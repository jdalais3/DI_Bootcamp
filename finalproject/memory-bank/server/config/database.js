const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create Sequelize instance with NeonDB connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // For development only, set to true in production
    }
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false
});

module.exports = sequelize;
