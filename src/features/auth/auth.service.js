import { pool } from '../../core/database/pool.js';
import { AuthenticationError } from './auth.error.js';
import bcrypt from 'bcrypt';

async function findUser(email) {
  const [rows] = await pool.query(
    'SELECT `email`, `password` FROM `users` WHERE `email` = ? LIMIT 1',
    [email],
  );

  if (!rows.length) {
    throw new AuthenticationError('email not found');
  }

  return rows[0];
}

async function verifyUserPassword(password, user) {
  if (!(await bcrypt.compare(password, user.password))) {
    throw new AuthenticationError('password incorrect');
  }
}

export async function login(credential) {
  const user = await findUser(credential.email);

  await verifyUserPassword(credential.password, user);

  return user;
}
