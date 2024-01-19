const path = require('path');
const { config: appConfig } = require('../app/app.config');

exports.config = {
  publicPath: path.join(__dirname, '../../../storage/public'),
  uploadPath: path.join(__dirname, '../../../storage/public/uploads'),
  baseUrl: `${appConfig.serverUrl}/public`,
};
