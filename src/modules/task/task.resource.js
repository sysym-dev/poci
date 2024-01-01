const Joi = require('joi');
const { Task } = require('./model/task.model.js');
const { Op } = require('sequelize');
const { optionalProperty } = require('../../utils/object.js');
const {
  createExistsValidation,
} = require('../../resource/schema/validations/create-exists-validation.js');
const {
  TaskCategory,
} = require('../task-category/model/task-category.model.js');

exports.TaskResource = class {
  url = '/tasks';
  model = Task;

  attributes() {
    return [
      'id',
      'name',
      'description',
      'status',
      'due_at',
      'createdAt',
      'updatedAt',
    ];
  }

  schema(options) {
    return {
      name: options.isUpdating
        ? Joi.string().optional()
        : Joi.string().required(),
      description: Joi.string().optional().allow('', null),
      ...optionalProperty(options.isUpdating, {
        status: Joi.string().valid('todo', 'in-progress', 'done').optional(),
      }),
      due_at: Joi.date().optional().allow(null),
      task_category_id: options.isUpdating
        ? Joi.number()
            .optional()
            .external(
              createExistsValidation({ model: TaskCategory, field: 'id' }),
            )
        : Joi.number()
            .required()
            .external(
              createExistsValidation({ model: TaskCategory, field: 'id' }),
            ),
    };
  }

  filterables() {
    return {
      search: Joi.string().optional().allow(null, ''),
      status: Joi.string().valid('todo', 'in-progress', 'done').optional(),
      status_in: Joi.array()
        .items(Joi.string().valid('todo', 'in-progress', 'done'))
        .optional(),
      task_category_id: Joi.number().positive(),
      due_at_from: Joi.date().optional(),
      due_at_to: Joi.date().optional(),
    };
  }

  sortables() {
    return ['name'];
  }

  relations() {
    return ['task_category'];
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
      ...optionalProperty(query.task_category_id, {
        task_category_id: query.task_category_id,
      }),
      ...optionalProperty(query.due_at_from || query.due_at_to, {
        due_at: {
          ...optionalProperty(query.due_at_from, {
            [Op.gt]: query.due_at_from,
          }),
          ...optionalProperty(query.due_at_to, {
            [Op.lt]: query.due_at_to,
          }),
        },
      }),
    };
  }
};
