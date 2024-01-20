const Joi = require('joi');

exports.RefreshTokenSchema = {
  token: Joi.string().required(),
};
