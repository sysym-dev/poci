const Joi = require('joi');
const { Task } = require('./task.model.js');
const { Op } = require('sequelize');
const { optionalProperty } = require('../../utils/object.js');
const {
  createExistsValidation,
} = require('../../resource/schema/validations/create-exists-validation.js');
const { TaskCategory } = require('../task-category/task-category.model.js');

exports.TaskResource = class {
  url = '/tasks';
  model = Task;

  schema(options) {
    return {
      name: options.isUpdating
        ? Joi.string().optional()
        : Joi.string().required(),
      description: Joi.string().optional(),
      ...optionalProperty(options.isUpdating, {
        status: Joi.string().valid('todo', 'in-progress', 'done').optional(),
      }),
      task_category_id: Joi.number()
        .required()
        .external(createExistsValidation({ model: TaskCategory, field: 'id' })),
    };
  }

  filterables() {
    return {
      search: Joi.string().optional(),
      status: Joi.string().valid('todo', 'in-progress', 'done').optional(),
      status_in: Joi.array()
        .items(Joi.string().valid('todo', 'in-progress', 'done'))
        .optional(),
    };
  }

  sortables() {
    return ['name'];
  }

  filter(query) {
    return {
      ...optionalProperty(query.search, {
        name: {
          [Op.substring]: query.search,
        },
      }),
      ...optionalProperty(query.status, {
        status: query.status,
      }),
      ...optionalProperty(query.status_in, {
        status: {
          [Op.in]: query.status_in,
        },
      }),
    };
  }
};
