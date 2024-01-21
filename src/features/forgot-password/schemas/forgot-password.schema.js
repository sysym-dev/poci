const Joi = require('joi');

exports.ForgotPasswordSchema = {
  email: Joi.string().email().required(),
};
