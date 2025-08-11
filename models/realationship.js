const User = require('./user-model');
const FileUpload = require('./file-model');

// 1:N relationship (One user can have many file uploads)
User.hasMany(FileUpload, {
  foreignKey: 'userId',
  as: 'files'
});

FileUpload.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

module.exports = { User, FileUpload };