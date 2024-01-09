const Joi = require('joi');

exports.UpdatePasswordSchema = {
  password: Joi.string().required(),
  password_confirmation: Joi.string().required().valid(Joi.ref('password')),
};
