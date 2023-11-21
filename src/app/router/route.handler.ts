import { Handler } from 'express-serve-static-core';
import { RouteContext } from './route.context';

export interface RouteHandler<P = any> {
  path: string;
  method: 'get' | 'post' | 'patch' | 'delete';
  middlewares?: Handler[];
  handler: (context: RouteContext) => P | Promise<P>;
}
