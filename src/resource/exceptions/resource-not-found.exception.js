const { ResourceException } = require('./resource.exception');

exports.ResourceNotFoundException = class extends ResourceException {
  constructor(message = 'Resource not found') {
    super(404, 'Not Found', message);
  }
};
