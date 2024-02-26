import { pool } from '../../core/database/pool.js';

export async function newTodayActivity({ name, userId }) {
  const dueDate = new Date();

  return await pool.execute(
    'INSERT INTO activities (name, due_date, user_id) VALUES (?, ?, ?)',
    [name, dueDate, userId],
  );
}
