import { createAuthMiddleware } from '../../middlewares/auth.middleware';
import { createRouter } from '../../router/router';
import { AuthService } from '../auth/auth.service';
import { TodoRepository } from '../todo/todo.repository';
import { UserRepository } from '../user/user.repository';
import { DashboardHandler } from './dashboard.handler';

const router = createRouter('/dashboard');
const handler = new DashboardHandler(new TodoRepository());

router.handle({
  path: '/',
  method: 'get',
  middlewares: [createAuthMiddleware(new AuthService(new UserRepository()))],
  handler: async (context) => await handler.get(),
});

export const dashboardRoutes = router.make();
