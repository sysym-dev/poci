const { HttpException } = require('./http.exception');

exports.UnauthorizedException = class extends HttpException {
  constructor(message = 'Unauthorized', details = null) {
    super(401, 'Unauthorized', message ?? 'Unauthorized', details);
  }
};
