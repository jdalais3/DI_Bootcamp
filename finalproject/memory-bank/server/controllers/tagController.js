const { Tag, Memory, MemoryTag, sequelize } = require('../models');
const { Op } = require('sequelize');

// Get all tags
const getAllTags = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Find all tags used by the user's memories
    const tags = await Tag.findAll({
      include: [{
        model: Memory,
        attributes: [],
        where: { user_id: userId }
      }],
      order: [['name', 'ASC']]
    });
    
    res.json(tags);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTags
};