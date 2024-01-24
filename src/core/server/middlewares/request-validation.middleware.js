const { ValidationError } = require('joi');
const {
  UnprocessableEntityException,
} = require('../../../core/server/exceptions/unprocessable-entity.exception');
const Joi = require('joi');

exports.createRequestValidation = function (rawSchema, options) {
  return async (req, res, next) => {
    try {
      const schema = Object.fromEntries(
        Object.entries(rawSchema).map(([key, value]) => {
          if (typeof value !== 'function') {
            return [key, value];
          }

          return [key, value({ me: req.me })];
        }),
      );

      const data = await Joi.object(schema).validateAsync(req[options.path]);

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
