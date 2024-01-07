const Joi = require('joi');
const { createRequestValidation } = require('./create-request-validation');

exports.createBodyValidation = function (schema) {
  return createRequestValidation(Joi.object(schema), {
    path: 'body',
  });
};
