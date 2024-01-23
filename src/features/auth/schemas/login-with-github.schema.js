const Joi = require('joi');

exports.LoginWithGithubSchema = {
  code: Joi.string().required(),
};
