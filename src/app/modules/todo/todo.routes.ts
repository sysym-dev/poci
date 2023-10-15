import { createRouter } from '../../router/router';
import { TodoHandler } from './todo.handler';

const router = createRouter('/todo');
const todoHandler = new TodoHandler();

router.handle({
  path: '/',
  method: 'get',
  handler: todoHandler.getAll,
});

export const todoRoutes = router.make();
