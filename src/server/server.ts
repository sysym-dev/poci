import { ServerConfig } from './config';
import express from 'express';

export class Server {
  private app: express.Application;
  private config: ServerConfig;

  constructor(config: ServerConfig) {
    this.config = config;

    this.app = express();
  }

  listen(cb?: (port: number) => void) {
    this.app.listen(this.config.port, () => {
      if (cb) {
        cb(this.config.port);
      }
    });
  }
}
