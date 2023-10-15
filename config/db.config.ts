import { DatabaseConfig } from '../src/db/config';

export const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST as string,
  port: parseInt(process.env.DB_HOST as string),
  database: process.env.DB_NAME as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
};
