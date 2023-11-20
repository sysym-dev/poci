import {
  RequestHandler,
  Router as ExpressRouter,
  Handler,
  Request,
  Response,
} from 'express';
import { User } from '../modules/user/user.entity';

export interface RouterContext {
  params: Record<string, any>;
  query: Record<string, any>;
  body: Record<string, any>;
  user?: User;
}
export interface RouteHandler<P = any> {
  path: string;
  method: 'get' | 'post' | 'patch' | 'delete';
  middlewares?: Handler[];
  handler: (context: RouterContext) => P | Promise<P>;
}
export interface RouterRequest extends Request {
  user?: User;
}

class Router {
  private router: ExpressRouter = ExpressRouter();
  private routeHandlers: RouteHandler[] = [];
  private basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  handle<P>(handler: RouteHandler<P>) {
    this.routeHandlers.push(handler);
  }

  make(): RequestHandler {
    this.routeHandlers.forEach((routeHandle) => {
      const requestHandler: RequestHandler = async (
        req: RouterRequest,
        res: Response,
        next,
      ) => {
        try {
          return res.status(200).json({
            status: 200,
            data: await routeHandle.handler({
              body: req.body,
              params: req.params,
              query: req.query,
              user: req['user'],
            }),
          });
        } catch (err) {
          next(err);
        }
      };

      this.router[routeHandle.method](`${this.basePath}${routeHandle.path}`, [
        ...(routeHandle.middlewares ? routeHandle.middlewares : []),
        requestHandler,
      ]);
    });

    return this.router;
  }
}

export function createRouter(basePath: string) {
  return new Router(basePath);
}
