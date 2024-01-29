const Joi = require('joi');
const { Task } = require('./model/task.model.js');
const { Op } = require('sequelize');
const { optionalProperty } = require('../../core/utils/object.js');
const {
  createExistsRule,
} = require('../../core/validation/rules/exists.rule.js');
const {
  TaskCategory,
} = require('../task-category/model/task-category.model.js');
const {
  createRequireAuth,
} = require('../auth/middlewares/require-auth.middleware.js');

exports.TaskResource = class {
  url = '/tasks';
  model = Task;

  middlewares() {
    return [createRequireAuth()];
  }

  defaultFilter({ me }) {
    return {
      user_id: me.id,
    };
  }

  defaultValues({ me }) {
    return {
      userId: me.id,
    };
  }

  attributes() {
    return [
      'id',
      'name',
      'description',
      'status',
      'due_at',
      'created_at',
      'updated_at',
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
      due_at: [Joi.date().optional().allow(null), 'dueAt'],
      task_category_id: [
        ({ me }) => {
          const existsRule = createExistsRule({
            model: TaskCategory,
            field: 'id',
            where: {
              user_id: me.id,
            },
          });

          return options.isUpdating
            ? Joi.number().optional().external(existsRule)
            : Joi.number().required().external(existsRule);
        },
        'taskCategoryId',
      ],
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
    return ['taskCategory'];
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
        dueAt: {
          ...optionalProperty(query.due_at_from, {
            [Op.gte]: query.due_at_from,
          }),
          ...optionalProperty(query.due_at_to, {
            [Op.lte]: query.due_at_to,
          }),
        },
      }),
    };
  }
};
