const Joi = require('joi');

exports.VerifySchema = {
  token: Joi.string().required(),
};
