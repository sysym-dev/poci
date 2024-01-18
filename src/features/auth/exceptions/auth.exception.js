const {
  UnauthorizedException,
} = require('../../../core/server/exceptions/unauthorized.exception');

exports.AuthException = class extends UnauthorizedException {};
