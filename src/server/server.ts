import { ServerConfig } from './config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { createErrorHandler } from './error-handler';

export class Server {
  private app: express.Application;
  private config: ServerConfig;

  constructor(config: ServerConfig) {
    this.config = config;

    this.app = express();

    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  private setupMiddleware() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(morgan('tiny'));

    this.config.middlewares?.forEach((handler) => {
      this.app.use(handler);
    });
  }

  private setupRoutes() {
    this.config.routes?.forEach((requestHandler) => {
      this.app.use(requestHandler);
    });
  }

  private setupErrorHandler() {
    this.app.use(createErrorHandler());
  }

  listen(cb?: (port: number) => void) {
    this.app.listen(this.config.port, () => {
      if (cb) {
        cb(this.config.port);
      }
    });
  }
}
