const {
  UnprocessableEntityException,
} = require('../server/exceptions/unprocessable-entity.exception');

exports.FileUploadException = class extends UnprocessableEntityException {
  constructor(path, message) {
    super(null, {
      [path]: message,
    });
  }
};
