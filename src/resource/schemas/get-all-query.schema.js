const Joi = require('joi');

exports.GetAllQuerySchema = Joi.object({
  page: Joi.object({
    size: Joi.number().positive().optional(),
    number: Joi.number().positive().optional(),
  }),
});
