const Joi = require('joi');
const { Todo } = require('./todo.model.js');
const { Op } = require('sequelize');

exports.TodoResource = class {
  url = '/todos';
  model = Todo;

  schema(options) {
    return Joi.object({
      name: options.isUpdating
        ? Joi.string().optional()
        : Joi.string().required(),
      description: Joi.string().optional(),
      ...(options.isUpdating
        ? {
            status: Joi.string().valid('todo', 'inprogress', 'done').optional(),
          }
        : {}),
    });
  }

  filterables() {
    return Joi.object({
      search: Joi.string().optional(),
      status: Joi.string().valid('todo', 'inprogress', 'done').optional(),
    });
  }

  filter(query) {
    return {
      ...(query.search
        ? {
            name: {
              [Op.substring]: query.search,
            },
          }
        : {}),
      ...(query.status
        ? {
            status: query.status,
          }
        : {}),
    };
  }
};
