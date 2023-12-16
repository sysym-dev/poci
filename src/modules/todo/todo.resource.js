const Joi = require('joi');
const { Todo } = require('./todo.model.js');
const { Op } = require('sequelize');
const { optionalProperty } = require('../../utils/object.js');

exports.TodoResource = class {
  url = '/todos';
  model = Todo;

  schema(options) {
    return {
      name: options.isUpdating
        ? Joi.string().optional()
        : Joi.string().required(),
      description: Joi.string().optional(),
      ...optionalProperty(options.isUpdating, {
        status: Joi.string().valid('todo', 'inprogress', 'done').optional(),
      }),
    };
  }

  filterables() {
    return {
      search: Joi.string().optional(),
      status: Joi.string().valid('todo', 'inprogress', 'done').optional(),
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
    };
  }
};
