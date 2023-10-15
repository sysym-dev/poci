import { RequestHandler } from 'express';
import { todoRoutes } from '../modules/todo/todo.routes';

export const routes: RequestHandler[] = [todoRoutes];
