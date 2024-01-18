const {
  UnauthorizedException,
} = require('../../../core/server/exceptions/unauthorized.exception');
const { AuthService } = require('../auth.service');

exports.createAuthMiddleware = function () {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new UnauthorizedException('Access Token Required');
      }

      req.me = await AuthService.verifyToken(token);

      return next();
    } catch (err) {
      return next(new UnauthorizedException(err.message));
    }
  };
};
