const Joi = require('joi');

exports.ResendSchema = {
  email: Joi.string().email().required(),
};
