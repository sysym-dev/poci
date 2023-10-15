import { ServerConfig } from '../src/server/config';

export const serverConfig: ServerConfig = {
  port: parseInt(process.env.PORT as string),
};
