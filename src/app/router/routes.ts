import { RequestHandler } from 'express';
import { todoRoutes } from '../modules/todo/todo.routes';
import { dashboardRoutes } from '../modules/dashboard/dashboard.route';
import { authRoutes } from '../modules/auth/auth.route';

export const routes: RequestHandler[] = [
  todoRoutes,
  dashboardRoutes,
  authRoutes,
];
