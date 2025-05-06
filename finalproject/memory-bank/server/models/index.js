const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// Define User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('patient', 'caregiver', 'family'),
    allowNull: false
  }
}, {
  tableName: 'users',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Define Memory model
const Memory = sequelize.define('Memory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {}
  },
  memory_type: {
    type: DataTypes.ENUM('text', 'photo', 'audio', 'video'),
    allowNull: false
  },
  importance: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  date_of_memory: {
    type: DataTypes.DATE,
    allowNull: true
  },
  location: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  tableName: 'memories',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Define Tag model
const Tag = sequelize.define('Tag', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  }
}, {
  tableName: 'tags',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Define MemoryTag model (junction table)
const MemoryTag = sequelize.define('MemoryTag', {
  memory_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'memories',
      key: 'id'
    }
  },
  tag_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'tags',
      key: 'id'
    }
  }
}, {
  tableName: 'memory_tags',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Define MemoryRelationship model
const MemoryRelationship = sequelize.define('MemoryRelationship', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  source_memory_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'memories',
      key: 'id'
    }
  },
  target_memory_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'memories',
      key: 'id'
    }
  },
  relationship_type: {
    type: DataTypes.ENUM('related', 'follows', 'precedes'),
    allowNull: false
  }
}, {
  tableName: 'memory_relationships',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Define MemoryAccess model
const MemoryAccess = sequelize.define('MemoryAccess', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  memory_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'memories',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  access_level: {
    type: DataTypes.ENUM('view', 'edit', 'manage'),
    allowNull: false
  }
}, {
  tableName: 'memory_access',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Define CaregiverPatient model
const CaregiverPatient = sequelize.define('CaregiverPatient', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  caregiver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  access_level: {
    type: DataTypes.ENUM('basic', 'full'),
    allowNull: false,
    defaultValue: 'basic'
  }
}, {
  tableName: 'caregiver_patients',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Relationships
User.hasMany(Memory, { foreignKey: 'user_id' });
Memory.belongsTo(User, { foreignKey: 'user_id' });

Memory.belongsToMany(Tag, { through: MemoryTag, foreignKey: 'memory_id' });
Tag.belongsToMany(Memory, { through: MemoryTag, foreignKey: 'tag_id' });

Memory.hasMany(MemoryRelationship, { as: 'SourceRelationships', foreignKey: 'source_memory_id' });
Memory.hasMany(MemoryRelationship, { as: 'TargetRelationships', foreignKey: 'target_memory_id' });
MemoryRelationship.belongsTo(Memory, { as: 'SourceMemory', foreignKey: 'source_memory_id' });
MemoryRelationship.belongsTo(Memory, { as: 'TargetMemory', foreignKey: 'target_memory_id' });

Memory.hasMany(MemoryAccess, { foreignKey: 'memory_id' });
MemoryAccess.belongsTo(Memory, { foreignKey: 'memory_id' });
User.hasMany(MemoryAccess, { foreignKey: 'user_id' });
MemoryAccess.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(CaregiverPatient, { as: 'PatientConnections', foreignKey: 'caregiver_id' });
User.hasMany(CaregiverPatient, { as: 'CaregiverConnections', foreignKey: 'patient_id' });
CaregiverPatient.belongsTo(User, { as: 'Caregiver', foreignKey: 'caregiver_id' });
CaregiverPatient.belongsTo(User, { as: 'Patient', foreignKey: 'patient_id' });

module.exports = {
  sequelize,
  User,
  Memory,
  Tag,
  MemoryTag,
  MemoryRelationship,
  MemoryAccess,
  CaregiverPatient
};
