import { createRouter } from '../../router/router';
import { TodoHandler } from './todo.handler';
import { TodoRepository } from './todo.repository';

const router = createRouter('/todos');
const todoHandler = new TodoHandler(new TodoRepository());

router.handle({
  path: '/',
  method: 'get',
  handler: async (context) => await todoHandler.getAll(context),
});

router.handle({
  path: '/',
  method: 'post',
  handler: async (context) => await todoHandler.create(context),
});

export const todoRoutes = router.make();
