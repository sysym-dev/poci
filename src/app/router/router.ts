import {
  RequestHandler,
  Router as ExpressRouter,
  Handler,
  Response,
} from 'express';
import { RouteHandler } from './route.handler';
import { Request } from './request/request';

class Router {
  private router: ExpressRouter = ExpressRouter();
  private routeHandlers: RouteHandler[] = [];
  private basePath: string;
  private middlewares: Handler[] = [];

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  handle<P>(handler: RouteHandler<P>) {
    this.routeHandlers.push(handler);
  }

  make(): RequestHandler {
    this.routeHandlers.forEach((routeHandle) => {
      const requestHandler: RequestHandler = async (
        req: Request,
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
        ...this.middlewares,
        ...(routeHandle.middlewares ? routeHandle.middlewares : []),
        requestHandler,
      ]);
    });

    return this.router;
  }

  addMiddleware(handler: Handler) {
    this.middlewares.push(handler);
  }
}

export function createRouter(basePath: string) {
  return new Router(basePath);
}
