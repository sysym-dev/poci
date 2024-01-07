const {
  UnauthorizedException,
} = require('../../../server/exceptions/unauthorized.exception');
const jwt = require('jsonwebtoken');
const { config } = require('../auth.config');
const { AuthService } = require('../auth.service');

exports.createAuthMiddleware = function () {
  return async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new UnauthorizedException('Access Token Required');
    }

    try {
      req.me = await AuthService.verifyToken(token);

      return next();
    } catch (err) {
      return next(new UnauthorizedException(err.message));
    }
  };
};
