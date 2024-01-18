const Joi = require('joi');
const {
  createRequestValidation,
} = require('../../server/handlers/request-validation.handler');

exports.createGetAllQueryValidation = function (options) {
  const { filterables = {}, sortables = [], relations = [] } = options;

  const schema = Joi.object({
    page: Joi.object({
      size: Joi.number().positive().optional(),
      number: Joi.number().positive().optional(),
    }),
    filter: Joi.object(filterables),
    sort: {
      column: Joi.string()
        .valid('id', ...sortables)
        .optional(),
      direction: Joi.string().valid('asc', 'desc').optional(),
    },
    include: Joi.array()
      .items(Joi.string().valid(...relations))
      .optional(),
  });

  return createRequestValidation(schema, {
    path: 'query',
  });
};
