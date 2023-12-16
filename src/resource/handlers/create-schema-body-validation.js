const Joi = require('joi');
const { createRequestValidation } = require('./create-request-validation');

exports.createSchemaBodyValidation = function (schema) {
  return createRequestValidation(Joi.object(schema), {
    path: 'body',
  });
};
