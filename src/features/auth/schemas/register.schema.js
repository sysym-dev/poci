const Joi = require('joi');
const {
  createUniqueRule,
} = require('../../../core/validation/rules/unique.rule');
const { User } = require('../../user/model/user.model');

exports.RegisterSchema = {
  name: Joi.string().required(),
  email: Joi.string()
    .email()
    .required()
    .external(
      createUniqueRule({
        model: User,
        field: 'email',
      }),
    ),
  password: Joi.string().required(),
  password_confirmation: Joi.string().required().valid(Joi.ref('password')),
};
