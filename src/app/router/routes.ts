import { RequestHandler } from 'express';
import { todoRoutes } from '../modules/todo/todo.routes';
import { dashboardRoutes } from '../modules/dashboard/dashboard.route';

export const routes: RequestHandler[] = [todoRoutes, dashboardRoutes];
