const {
  NotFoundException,
} = require('../../server/exceptions/not-found.exception');

exports.RefreshTokenException = class extends NotFoundException {};
