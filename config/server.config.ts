import { middlewares } from '../src/app/middlewares';
import { routes } from '../src/app/router/routes';
import { ServerConfig } from '../src/server/config';

export const serverConfig: ServerConfig = {
  port: parseInt(process.env.PORT as string),
  middlewares,
  routes,
};
