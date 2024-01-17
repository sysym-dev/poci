const Joi = require('joi');

exports.UpdateEmailSchema = {
  email: Joi.string().email().required(),
};
