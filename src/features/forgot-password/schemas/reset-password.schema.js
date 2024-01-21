const Joi = require('joi');

exports.ResetPasswordSchema = {
  token: Joi.string().required(),
  password: Joi.string().required(),
  password_confirmation: Joi.string().required().valid(Joi.ref('password')),
};
