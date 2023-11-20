import './env';

import { serverConfig } from './config/server.config';
import { Server } from './src/server/server';
import { connect } from './src/db/connect';
import { AuthConfig } from 'otentikasi';

const server = new Server(serverConfig);

async function run() {
  try {
    await connect();

    AuthConfig.setSecret('test');

    server.listen((port: number) => {
      console.log(`server listening at ${port}`);
    });
  } catch (err) {
    console.error(err);

    process.exit(1);
  }
}

run();
