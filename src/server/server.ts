import { ServerConfig } from './config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

export class Server {
  private app: express.Application;
  private config: ServerConfig;

  constructor(config: ServerConfig) {
    this.config = config;

    this.app = express();

    this.setupMiddleware();
  }

  private setupMiddleware() {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(morgan('tiny'));
  }

  listen(cb?: (port: number) => void) {
    this.app.listen(this.config.port, () => {
      if (cb) {
        cb(this.config.port);
      }
    });
  }
}
