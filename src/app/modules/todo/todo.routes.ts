import { createRouter } from '../../router/router';
import { TodoHandler } from './todo.handler';
import { TodoRepository } from './todo.repository';

const router = createRouter('/todos');
const todoHandler = new TodoHandler(new TodoRepository());

router.handle({
  path: '/',
  method: 'get',
  handler: (context) => todoHandler.getAll(context),
});

export const todoRoutes = router.make();
