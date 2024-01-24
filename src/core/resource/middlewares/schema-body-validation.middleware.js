const Joi = require('joi');
const {
  createRequestValidation,
} = require('../../server/middlewares/request-validation.middleware');

exports.createSchemaBodyValidation = function (schema) {
  const bodySchema = Object.fromEntries(
    Object.entries(schema).map(([key, value]) => {
      if (Array.isArray(value)) {
        return [key, value[0]];
      }

      return [key, value];
    }),
  );
  return [
    createRequestValidation(bodySchema, {
      path: 'body',
    }),
    (req, res, next) => {
      req.body = Object.fromEntries(
        Object.entries(req.body).map(([key, value]) => {
          if (Array.isArray(schema[key])) {
            return [schema[key][1], value];
          }

          return [key, value];
        }),
      );

      next();
    },
  ];
};
