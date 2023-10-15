import knex from 'knex';
import { dbConfig } from '../../config/db.config';

export const db = knex({
  client: 'mysql2',
  connection: dbConfig,
});
