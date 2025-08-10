const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')

const FileUpload = sequelize.define('FileUpload', {
  originalname: {
    type: DataTypes.STRING(255), // max 255 chars
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Filename is required' },
      len: {
        args: [1, 255],
        msg: 'Filename too long',
      },
    },
  },
  mimetype: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'MIME type is required' },
    },
  },
  size: {
    type: DataTypes.INTEGER.UNSIGNED, // positive integer
    allowNull: false,
    validate: {
      min: {
        args: [1],
        msg: 'File size must be positive',
      },
      max: {
        args: [5 * 1024 * 1024],
        msg: 'File size cannot exceed 5MB',
      },
    },
  },
  buffer: {
    type: DataTypes.BLOB('long'), // store file binary
    allowNull: false,
    validate: {
      notEmpty: { msg: 'File data must be provided' },
    },
  },
}, {
  tableName: 'file_uploads',
  timestamps: true
});

module.exports = FileUpload;