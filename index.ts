import './env';

import { serverConfig } from './config/server.config';
import { authConfig } from './config/auth.config';
import { Server } from './src/server/server';
import { connect } from './src/db/connect';
import { AuthConfig } from 'otentikasi';

const server = new Server(serverConfig);

async function run() {
  try {
    await connect();

    AuthConfig.setSecret(authConfig.secret);

    server.listen((port: number) => {
      console.log(`server listening at ${port}`);
    });
  } catch (err) {
    console.error(err);

    process.exit(1);
  }
}

run();
