const { HttpException } = require('./http.exception');

exports.UnauthorizedException = class extends HttpException {
  constructor(message = 'Unauthorized', details) {
    super(401, 'Unauthorized', message ?? 'Unauthorized', details);
  }
};
