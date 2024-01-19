const { config } = require('./app.config');

exports.generateServerUrl = (path) => `${config.serverUrl}${path}`;
