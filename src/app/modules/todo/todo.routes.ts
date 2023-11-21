import { createAuthMiddleware } from '../../middlewares/auth.middleware';
import { createRequestValidatorMiddleware } from '../../middlewares/request-validator.middleware';
import { createReadAllResourceMiddleware } from '../../middlewares/resource-query.middleware';
import { createRouter } from '../../router/router';
import { AuthService } from '../auth/auth.service';
import { UserRepository } from '../user/user.repository';
import { CreateTodoRequest } from './requests/create.request';
import { ReadAllTodoRequest } from './requests/read-all.request';
import { UpdateTodoRequest } from './requests/update.request';
import { TodoHandler } from './todo.handler';
import { TodoRepository } from './todo.repository';

const router = createRouter('/todos');
const todoHandler = new TodoHandler(new TodoRepository());

router.addMiddleware(
  createAuthMiddleware(new AuthService(new UserRepository())),
);

router.handle({
  path: '/',
  method: 'get',
  middlewares: [createReadAllResourceMiddleware(ReadAllTodoRequest)],
  handler: async (context) => await todoHandler.getAll(context),
});

router.handle({
  path: '/:id',
  method: 'get',
  handler: async (context) => await todoHandler.getOne(context),
});

router.handle({
  path: '/',
  method: 'post',
  middlewares: [createRequestValidatorMiddleware(CreateTodoRequest)],
  handler: async (context) => await todoHandler.create(context),
});

router.handle({
  path: '/:id',
  method: 'patch',
  middlewares: [createRequestValidatorMiddleware(UpdateTodoRequest)],
  handler: async (context) => await todoHandler.update(context),
});

router.handle({
  path: '/:id',
  method: 'delete',
  handler: async (context) => await todoHandler.delete(context),
});

export const todoRoutes = router.make();
