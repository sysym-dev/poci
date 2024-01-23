const Joi = require('joi');

exports.LoginWithGoogleSchema = {
  token: Joi.string().required(),
};
