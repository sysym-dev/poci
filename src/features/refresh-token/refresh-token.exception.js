const {
  NotFoundException,
} = require('../../core/server/exceptions/not-found.exception');

exports.RefreshTokenException = class extends NotFoundException {};
