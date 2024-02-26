import { pool } from '../../core/database/pool.js';
import { NotFoundError } from '../../core/server/errors/not-found.error.js';

export async function findCollectionItem({ id, userId }) {
  const [rows] = await pool.execute(
    `SELECT id, name, collection_id FROM collection_items WHERE id = ? AND user_id = ?`,
    [id, userId],
  );

  if (!rows.length) {
    throw new NotFoundError('Collection item not found');
  }

  return rows[0];
}

export async function updateCollectionItem({ id, userId }, payload) {
  const [res] = await pool.execute(
    `
        UPDATE collection_items
        SET name = ?
        WHERE
            id = ?
            AND user_id = ?
    `,
    [payload.name, id, userId],
  );

  if (!res.affectedRows) {
    throw new NotFoundError('Collection item not found');
  }
}

export async function updateCollectionItemIsDone({ id, userId }, isDone) {
  const [res] = await pool.execute(
    `UPDATE collection_items SET is_done = ? WHERE id = ? AND user_id = ?`,
    [isDone, id, userId],
  );

  if (!res.affectedRows) {
    throw new NotFoundError('Collection item not found');
  }
}

export async function deleteCollectionItem({ id, userId }) {
  const [res] = await pool.execute(
    `DELETE FROM collection_items WHERE id = ? AND user_id = ?`,
    [id, userId],
  );

  if (!res.affectedRows) {
    throw new NotFoundError('Collection item not found');
  }
}
