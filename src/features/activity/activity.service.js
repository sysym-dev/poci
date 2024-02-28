import { pool } from '../../core/database/pool.js';
import { NotFoundError } from '../../core/server/errors/not-found.error.js';

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

export async function deleteActivity({ id, userId }) {
  const [res] = await pool.execute(
    `DELETE FROM activities WHERE id = ? AND user_id = ?`,
    [id, userId],
  );

  if (!res.affectedRows) {
    throw new NotFoundError('Activity Not Found');
  }
}

export async function findTodayActivity({ id, userId }) {
  const [res] = await pool.execute(
    'SELECT id, name FROM activities WHERE id = ? AND user_id = ? LIMIT 1',
    [id, userId],
  );

  if (!res.length) {
    throw new NotFoundError('Activity Not Found');
  }

  return res[0];
}

export async function updateTodayActivity({ id, userId }, { name }) {
  const [res] = await pool.execute(
    'UPDATE activities SET name = ? WHERE id = ? AND user_id = ?',
    [name, id, userId],
  );

  if (!res.affectedRows) {
    throw new NotFoundError('Activity Not Found');
  }
}

export async function updateActivityIsDone({ id, userId }, isDone) {
  const [res] = await pool.execute(
    'UPDATE activities SET is_done = ? WHERE id = ? AND user_id = ?',
    [isDone, id, userId],
  );

  if (!res.affectedRows) {
    throw new NotFoundError('Activity Not Found');
  }
}
