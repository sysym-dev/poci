const Joi = require('joi');
const { createRequestValidation } = require('./request-validation.middleware');

exports.createBodyValidation = function (schema) {
  return createRequestValidation(schema, {
    path: 'body',
  });
};
