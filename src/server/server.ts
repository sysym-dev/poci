import { ServerConfig } from './config';
import express from 'express';

export class Server {
  private app: express.Application = express();
  private config: ServerConfig = {
    port: 3000,
  };

  listen(cb?: (port: number) => void) {
    this.app.listen(this.config.port, () => {
      if (cb) {
        cb(this.config.port);
      }
    });
  }
}
