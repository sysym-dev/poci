const Joi = require('joi');
const {
  createUniqueRule,
} = require('../../../core/validation/rules/unique.rule');
const { User } = require('../../user/model/user.model');

exports.ResendSchema = {
  email: Joi.string()
    .email()
    .required()
    .external(
      createUniqueRule({
        model: User,
        field: 'email',
      }),
    ),
};
