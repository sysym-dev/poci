const {
  NotFoundException,
} = require('../../server/exceptions/not-found.exception');

exports.ResourceNotFoundException = class extends NotFoundException {
  constructor(message = 'Resource not found') {
    super(message ?? 'Resource not found');
  }
};
