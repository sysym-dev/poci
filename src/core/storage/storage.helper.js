const { config } = require('./storage.config');
const path = require('path');
const axios = require('axios');
const fs = require('fs/promises');

function getFileUrl(...paths) {
  return `${config.baseUrl}/${paths.join('/')}`;
}

exports.getUploadedFileUrl = function (...paths) {
  return getFileUrl(...['uploads', ...paths]);
};
exports.getUploadPath = function (...filename) {
  return path.resolve(config.uploadPath, ...filename);
};
exports.downloadFile = async function (url, filePath) {
  const res = await axios.get(url, {
    responseType: 'arraybuffer',
  });

  await fs.writeFile(filePath, res.data);
};

exports.getFileUrl = getFileUrl;
