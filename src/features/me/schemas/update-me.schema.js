const Joi = require('joi');

exports.UpdateMeSchema = {
  name: Joi.string().optional(),
};
