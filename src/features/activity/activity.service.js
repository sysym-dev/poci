import { pool } from '../../core/database/pool.js';

export async function newTodayActivity({ name, userId }) {
  const dueDate = new Date();

  return await pool.execute(
    'INSERT INTO activities (name, due_date, user_id) VALUES (?, ?, ?)',
    [name, dueDate, userId],
  );
}

export async function readActivities({ userId }) {
  const [rows] = await pool.execute(
    'SELECT id, name FROM activities WHERE user_id = ?',
    [userId],
  );

  return rows;
}
