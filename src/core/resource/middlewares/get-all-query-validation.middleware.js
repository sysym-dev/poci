const Joi = require('joi');
const {
  createRequestValidation,
} = require('../../server/middlewares/request-validation.middleware');

exports.createGetAllQueryValidation = function (options) {
  const { filterables = {}, sortables = [], relations = [] } = options;

  const schema = {
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
  };

  return createRequestValidation(schema, {
    path: 'query',
  });
};
