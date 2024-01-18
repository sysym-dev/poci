const Joi = require('joi');
const { createRequestValidation } = require('./request-validation.handler');

exports.createBodyValidation = function (schema) {
  return createRequestValidation(Joi.object(schema), {
    path: 'body',
  });
};
