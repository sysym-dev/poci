const {
  UnauthorizedException,
} = require('../../../server/exceptions/unauthorized.exception');

exports.AuthException = class extends UnauthorizedException {};
