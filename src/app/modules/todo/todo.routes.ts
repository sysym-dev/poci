import { createRequestValidatorMiddleware } from '../../middlewares/request-validator.middleware';
import { createRouter } from '../../router/router';
import { CreateTodoRequest } from './requests/create.request';
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
  middlewares: [createRequestValidatorMiddleware(CreateTodoRequest)],
  handler: async (context) => await todoHandler.create(context),
});

export const todoRoutes = router.make();
