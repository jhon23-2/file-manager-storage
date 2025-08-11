const User = require('./user-model');
const FileUpload = require('./file-model');

User.hasMany(FileUpload, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  },
  as: 'files'
});

FileUpload.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  },
  as: 'user'
});

module.exports = { User, FileUpload };