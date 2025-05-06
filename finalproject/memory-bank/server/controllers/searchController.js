const { Memory, Tag, User, sequelize } = require('../models');
const { Op } = require('sequelize');

// Search memories
const searchMemories = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { query, page = 1, limit = 10 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    // Build search query using JSONB functionality
    const searchCondition = {
      [Op.or]: [
        { title: { [Op.iLike]: `%${query}%` } },
        { content: { [Op.like]: `%${query}%` } } // Search in JSONB content
      ],
      user_id: userId
    };
    
    // Pagination settings
    const pagination = {
      offset: (page - 1) * limit,
      limit: parseInt(limit)
    };
    
    // Execute search query
    const { count, rows } = await Memory.findAndCountAll({
      where: searchCondition,
      ...pagination,
      include: [{ model: Tag }],
      order: [['date_of_memory', 'DESC']]
    });
    
    res.json({
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      memories: rows
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchMemories
};