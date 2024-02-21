import 'dotenv/config';
import { pool } from '../core/database/pool';
import bcrypt from 'bcrypt';

await pool.execute('INSERT INTO users (email, password) VALUES (?, ?)', [
  'test@email.com',
  await bcrypt.hash('password', 10),
]);

process.exit();
