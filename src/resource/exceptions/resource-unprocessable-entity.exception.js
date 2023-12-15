const { ResourceException } = require('./resource.exception');

exports.ResourceUnprocessableEntityException = class extends ResourceException {
  constructor(message = 'Invalid Request', details) {
    super(422, 'Unprocessable Entity', message ?? 'Invalid Request', details);
  }
};
