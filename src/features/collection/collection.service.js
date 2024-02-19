import { pool } from '../../core/database/pool.js';

export async function readCollections({ userId }) {
  const [rows] = await pool.query(
    'SELECT name FROM collections WHERE user_id = ?',
    [userId],
  );

  return rows;
}
