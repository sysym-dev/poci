import { Handler } from 'express';

export interface ServerConfig {
  port: number;
  middlewares?: Handler[];
}
