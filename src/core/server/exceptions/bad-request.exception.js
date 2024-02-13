const { HttpException } = require('./http.exception');

exports.BadRequestException = class extends HttpException {
  constructor(message = 'Bad Request', details = null) {
    super(400, 'Bad Request', message ?? 'Bad Request', details);
  }
};
