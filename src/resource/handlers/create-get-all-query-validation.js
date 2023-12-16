const Joi = require('joi');
const { createRequestValidation } = require('./create-request-validation');

exports.createGetAllQueryValidation = function (options) {
  const { filter = {}, sortables = [] } = options;

  const schema = Joi.object({
    page: Joi.object({
      size: Joi.number().positive().optional(),
      number: Joi.number().positive().optional(),
    }),
    filter,
    sort: {
      column: Joi.string()
        .valid('id', ...sortables)
        .optional(),
      direction: Joi.string().valid('asc', 'desc').optional(),
    },
  });

  return createRequestValidation(schema, {
    path: 'query',
  });
};
