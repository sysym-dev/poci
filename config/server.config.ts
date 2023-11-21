import { globalMiddlewares } from '../src/app/middlewares/global.middleware';
import { routes } from '../src/app/router/routes';
import { ServerConfig } from '../src/server/config';

export const serverConfig: ServerConfig = {
  port: parseInt(process.env.PORT as string),
  middlewares: globalMiddlewares,
  routes,
};
