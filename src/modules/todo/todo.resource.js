const Joi = require('joi');
const { Todo } = require('./todo.model.js');

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
            status: Joi.string().valid('todo', 'inprogress', 'done'),
          }
        : {}),
    });
  }
};
