const { config } = require('./storage.config');

const getFileUrl = (...paths) => `${config.baseUrl}/${paths.join('/')}`;
const getUploadedFileUrl = (...paths) => getFileUrl(...['uploads', ...paths]);

module.exports = {
  getFileUrl,
  getUploadedFileUrl,
};
