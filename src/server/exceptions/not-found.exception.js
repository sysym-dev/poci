const { HttpException } = require('./http.exception');

exports.NotFoundException = class extends HttpException {
  constructor(message = 'NotFound', details) {
    super(404, 'NotFound', message ?? 'NotFound', details);
  }
};
