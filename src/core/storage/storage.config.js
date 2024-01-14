const path = require('path');

exports.config = {
  publicPath: path.join(__dirname, '../../../storage/public'),
  uploadPath: path.join(__dirname, '../../../storage/public/uploads'),
  baseUrl: `${process.env.APP_URL}/public`,
};
