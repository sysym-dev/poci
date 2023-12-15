const Joi = require('joi');
const { Todo } = require('./todo.model.js');

exports.TodoResource = class {
  url = '/todos';
  model = Todo;
  schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
  });
};
