const { Todo } = require('./todo.model.js');

exports.TodoResource = class {
  url = '/todos';
  model = Todo;
};
