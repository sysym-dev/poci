import { pool } from '../../core/database/pool.js';
import { AuthenticationError } from './auth.error.js';
import bcrypt from 'bcrypt';

async function findUser(email) {
  const [rows] = await pool.execute(
    'SELECT id, email, password FROM users WHERE email = ? LIMIT 1',
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

export async function register(credential) {
  try {
    const [res] = await pool.execute(
      `
      INSERT INTO users
        (email, password)
      VALUES (?, ?)
    `,
      [credential.email, await bcrypt.hash(credential.password, 10)],
    );

    return {
      id: res.insertId,
    };
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      throw new AuthenticationError('email already used');
    }

    throw err;
  }
}
