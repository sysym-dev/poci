const Joi = require('joi');
const { createRequestValidation } = require('./create-request-validation');

exports.createGetOneQueryValidation = function (options) {
  const { relations = [] } = options;

  const schema = Joi.object({
    include: Joi.array()
      .items(Joi.string().valid(...relations))
      .optional(),
  });

  return createRequestValidation(schema, {
    path: 'query',
  });
};
