const {
  UnprocessableEntityException,
} = require('../../server/exceptions/unprocessable-entity.exception');

exports.ResourceUnprocessableEntityException = class extends (
  UnprocessableEntityException
) {
  constructor(message = 'Invalid Request', details) {
    super(422, 'Unprocessable Entity', message ?? 'Invalid Request', details);
  }
};
