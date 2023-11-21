import { Handler, RequestHandler } from 'express';

export interface ServerConfig {
  port: number;
  middlewares?: Handler[];
  routes?: RequestHandler[];
}
