const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')

const User = sequelize.define('User', {
  firstname: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: "First name is required" },
      len: {
        args: [2, 100],
        msg: "First name must be between 2 and 100 characters long"
      }
    }
  },
  lastname: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Last name is required' },
      len: {
        args: [2, 100],
        msg: 'Last name must be between 2 and 100 characters long',
      },
    },
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
      msg: 'Email already exists',
    },
    validate: {
      notEmpty: { msg: 'Email is required' },
      isEmail: { msg: 'Email is not valid' },
      len: {
        args: [2, 100],
        msg: 'Email must be between 2 and 100 characters long',
      },
    },
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
      msg: 'Username already exists',
    },
    validate: {
      notEmpty: { msg: 'Username is required' },
      len: {
        args: [2, 100],
        msg: 'Username must be between 2 and 100 characters long',
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Password is required' }
    }
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_on',
  updatedAt: 'updated_on'
})


module.exports = User