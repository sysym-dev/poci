const Joi = require('joi');
const { createRequestValidation } = require('./create-request-validation');

exports.createGetAllQueryValidation = function (options) {
  const { filter = {} } = options;

  const schema = Joi.object({
    page: Joi.object({
      size: Joi.number().positive().optional(),
      number: Joi.number().positive().optional(),
    }),
    filter,
  });

  return createRequestValidation(schema, {
    path: 'query',
  });
};
