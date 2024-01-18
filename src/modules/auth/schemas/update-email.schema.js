const Joi = require('joi');
const {
  createUniqueRole,
} = require('../../../core/validation/rules/unique.rule');
const { User } = require('../../user/model/user.model');

exports.UpdateEmailSchema = {
  email: Joi.string()
    .email()
    .required()
    .external(
      createUniqueRole({
        model: User,
        field: 'email',
      }),
    ),
};
