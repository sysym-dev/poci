const { HttpException } = require('./http.exception');

exports.NotFoundException = class extends HttpException {
  constructor(message = 'Not Found', details) {
    super(404, 'Not Found', message ?? 'Not Found', details);
  }
};
