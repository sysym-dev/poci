const crypto = require('crypto');

exports.randomToken = () => crypto.randomBytes(20).toString('hex');
