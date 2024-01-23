const { config } = require('./storage.config');
const path = require('path');

exports.getFileUrl = (...paths) => `${config.baseUrl}/${paths.join('/')}`;
exports.getUploadedFileUrl = (...paths) => getFileUrl(...['uploads', ...paths]);
exports.getUploadPath = (...filename) =>
  path.resolve(config.uploadPath, ...filename);
