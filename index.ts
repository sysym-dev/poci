import 'dotenv/config';

import { serverConfig } from './config/server.config';
import { Server } from './src/server/server';

const server = new Server(serverConfig);

server.listen((port: number) => {
  console.log(`Server listening at ${port}`);
});
