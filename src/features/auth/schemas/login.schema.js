const Joi = require('joi');

exports.LoginSchema = {
  email: Joi.string().email().required(),
  password: Joi.string().required(),
};
