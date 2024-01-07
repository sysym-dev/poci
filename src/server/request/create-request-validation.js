const { ValidationError } = require('joi');
const {
  UnprocessableEntityException,
} = require('../exceptions/unprocessable-entity.exception');

exports.createRequestValidation = function (schema, options) {
  return async (req, res, next) => {
    try {
      const data = await schema.validateAsync(req[options.path]);

      req[options.path] = data;

      return next();
    } catch (err) {
      if (err instanceof ValidationError) {
        return next(
          new UnprocessableEntityException(
            null,
            Object.fromEntries(
              err.details.map((field) => [field.path, field.message]),
            ),
          ),
        );
      }

      return next(err);
    }
  };
};
