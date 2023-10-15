import { RequestHandler, Router as ExpressRouter, Handler } from 'express';

export interface RouterContext {
  params: Record<string, any>;
  query: Record<string, any>;
  body: Record<string, any>;
}
export interface RouteHandler<P = any> {
  path: string;
  method: 'get' | 'post' | 'patch' | 'delete';
  middlewares?: Handler[];
  handler: (context?: RouterContext) => P | Promise<P>;
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
    const baseRoute = this.router.route(this.basePath);

    this.routeHandlers.forEach((routeHandle) => {
      const requestHandler: RequestHandler = async (req, res, next) => {
        try {
          return res.status(200).json({
            status: 200,
            data: await routeHandle.handler({
              body: req.body,
              params: req.params,
              query: req.query,
            }),
          });
        } catch (err) {
          next(err);
        }
      };

      baseRoute[routeHandle.method]([
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
