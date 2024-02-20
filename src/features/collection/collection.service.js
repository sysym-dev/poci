import { pool } from '../../core/database/pool.js';

export async function readCollections({ userId }) {
  const [rows] = await pool.execute(
    'SELECT name FROM collections WHERE user_id = ?',
    [userId],
  );

  return rows;
}

export async function newCollection(payload) {
  await pool.execute('INSERT INTO collections (name, user_id) VALUES (?, ?)', [
    payload.name,
    payload.userId,
  ]);
}
