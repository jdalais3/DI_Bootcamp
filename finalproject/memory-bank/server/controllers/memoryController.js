const { Memory, User, Tag, MemoryTag, MemoryAccess, sequelize } = require('../models');
const { Op } = require('sequelize');

// Get user's memories with pagination
const getUserMemories = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, type, startDate, endDate, tags } = req.query;
    
    // Build query filters
    const filter = { user_id: userId };
    
    if (type) {
      filter.memory_type = type;
    }
    
    if (startDate || endDate) {
      filter.date_of_memory = {};
      
      if (startDate) {
        filter.date_of_memory[Op.gte] = new Date(startDate);
      }
      
      if (endDate) {
        filter.date_of_memory[Op.lte] = new Date(endDate);
      }
    }
    
    // Pagination settings
    const pagination = {
      offset: (page - 1) * limit,
      limit: parseInt(limit)
    };
    
    // Build query options
    const queryOptions = {
      where: filter,
      ...pagination,
      include: [{
        model: Tag,
        through: { attributes: [] }
      }],
      order: [['date_of_memory', 'DESC']]
    };
    
    // If tags filter is provided
    if (tags) {
      const tagArray = tags.split(',');
      
      queryOptions.include[0].where = {
        name: {
          [Op.in]: tagArray
        }
      };
    }
    
    // Execute query
    const { count, rows } = await Memory.findAndCountAll(queryOptions);
    
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

// Create a new memory
const createMemory = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  
  try {
    const userId = req.user.id;
    const { title, content, memory_type, importance, date_of_memory, location, tags } = req.body;
    
    // Create memory
    const memory = await Memory.create({
      user_id: userId,
      title,
      content,
      memory_type,
      importance,
      date_of_memory: date_of_memory ? new Date(date_of_memory) : null,
      location
    }, { transaction });
    
    // Add tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
      for (const tagName of tags) {
        // Find or create tag
        const [tag] = await Tag.findOrCreate({
          where: { name: tagName },
          transaction
        });
        
        // Link tag to memory
        await MemoryTag.create({
          memory_id: memory.id,
          tag_id: tag.id
        }, { transaction });
      }
    }
    
    await transaction.commit();
    
    // Reload memory with tags
    const createdMemory = await Memory.findByPk(memory.id, {
      include: [{ model: Tag }]
    });
    
    // Emit socket event for notifications
    const io = req.app.get('io');
    if (io) {
      io.to(`user-${userId}`).emit('memory_created', {
        id: memory.id,
        title: memory.title,
        type: memory.memory_type,
        created_at: memory.created_at
      });
    }
    
    res.status(201).json(createdMemory);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

// Get a specific memory
const getMemory = async (req, res, next) => {
  try {
    const memoryId = req.params.id;
    const userId = req.user.id;
    
    // Find memory
    const memory = await Memory.findByPk(memoryId, {
      include: [{ model: Tag }]
    });
    
    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }
    
    // Check ownership or access permission
    if (memory.user_id !== userId) {
      // Check if user has access
      const access = await MemoryAccess.findOne({
        where: {
          memory_id: memoryId,
          user_id: userId
        }
      });
      
      if (!access) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
    }
    
    res.json(memory);
  } catch (error) {
    next(error);
  }
};

// Update a memory
const updateMemory = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  
  try {
    const memoryId = req.params.id;
    const userId = req.user.id;
    const { title, content, memory_type, importance, date_of_memory, location, tags } = req.body;
    
    // Find memory
    const memory = await Memory.findByPk(memoryId);
    
    if (!memory) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Memory not found' });
    }
    
    // Check ownership or edit permission
    if (memory.user_id !== userId) {
      // Check if user has edit access
      const access = await MemoryAccess.findOne({
        where: {
          memory_id: memoryId,
          user_id: userId,
          access_level: { [Op.in]: ['edit', 'manage'] }
        }
      });
      
      if (!access) {
        await transaction.rollback();
        return res.status(403).json({ error: 'Unauthorized access' });
      }
    }
    
    // Update memory
    await memory.update({
      title,
      content,
      memory_type,
      importance,
      date_of_memory: date_of_memory ? new Date(date_of_memory) : null,
      location
    }, { transaction });
    
    // Update tags if provided
    if (tags && Array.isArray(tags)) {
      // Remove existing tag associations
      await MemoryTag.destroy({
        where: { memory_id: memoryId },
        transaction
      });
      
      // Add new tags
      for (const tagName of tags) {
        // Find or create tag
        const [tag] = await Tag.findOrCreate({
          where: { name: tagName },
          transaction
        });
        
        // Link tag to memory
        await MemoryTag.create({
          memory_id: memory.id,
          tag_id: tag.id
        }, { transaction });
      }
    }
    
    await transaction.commit();
    
    // Reload memory with tags
    const updatedMemory = await Memory.findByPk(memory.id, {
      include: [{ model: Tag }]
    });
    
    res.json(updatedMemory);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

// Delete a memory
const deleteMemory = async (req, res, next) => {
  try {
    const memoryId = req.params.id;
    const userId = req.user.id;
    
    // Find memory
    const memory = await Memory.findByPk(memoryId);
    
    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }
    
    // Check ownership or manage permission
    if (memory.user_id !== userId) {
      // Check if user has manage access
      const access = await MemoryAccess.findOne({
        where: {
          memory_id: memoryId,
          user_id: userId,
          access_level: 'manage'
        }
      });
      
      if (!access) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
    }
    
    // Delete memory
    await memory.destroy();
    
    res.json({ message: 'Memory deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserMemories,
  createMemory,
  getMemory,
  updateMemory,
  deleteMemory
};