const { HttpException } = require('./http.exception');

exports.UnprocessableEntityException = class extends HttpException {
  constructor(message = 'Invalid Request', details) {
    super(422, 'Unprocessable Entity', message ?? 'Invalid Request', details);
  }
};
