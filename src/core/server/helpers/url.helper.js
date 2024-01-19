const { config } = require('../server.config');

exports.generateUrl = (path) => `${config.appUrl}${path}`;
