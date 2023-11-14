import { createRouter } from '../../router/router';
import { TodoRepository } from '../todo/todo.repository';
import { DashboardHandler } from './dashboard.handler';

const router = createRouter('/dashboard');
const handler = new DashboardHandler(new TodoRepository());

router.handle({
  path: '/',
  method: 'get',
  handler: async (context) => await handler.get(),
});

export const dashboardRoutes = router.make();
