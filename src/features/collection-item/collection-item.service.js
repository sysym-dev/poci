import { pool } from '../../core/database/pool.js';
import { NotFoundError } from '../../core/server/errors/not-found.error.js';

export async function findCollectionItem({ id, userId }) {
  const [rows] = await pool.query(
    `SELECT id, name, collection_id FROM collection_items WHERE id = ? AND user_id = ?`,
    [id, userId],
  );

  if (!rows.length) {
    throw new NotFoundError('Collection item not found');
  }

  return rows[0];
}

export async function updateCollectionItem({ id, userId }, payload) {
  const [res] = await pool.query(
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
