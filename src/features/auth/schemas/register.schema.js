const Joi = require('joi');
const {
  createUniqueValidation,
} = require('../../../server/request/custom-schema-validation/create-unique-validation');
const { User } = require('../..//user/model/user.model');

exports.RegisterSchema = {
  name: Joi.string().required(),
  email: Joi.string()
    .email()
    .required()
    .external(
      createUniqueValidation({
        model: User,
        field: 'email',
      }),
    ),
  password: Joi.string().required(),
};
