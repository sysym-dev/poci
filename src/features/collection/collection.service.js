import { pool } from '../../core/database/pool.js';
import { NotFoundError } from '../../core/server/errors/not-found.error.js';

export async function readCollections({ userId }) {
  const [rows] = await pool.execute(
    'SELECT id, name FROM collections WHERE user_id = ?',
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

export async function findCollection({ id, userId }) {
  const [rows] = await pool.execute(
    'SELECT id, name FROM collections WHERE id = ? AND user_id = ?',
    [id, userId],
  );

  if (!rows.length) {
    throw new NotFoundError('Collection not found');
  }

  return rows[0];
}

export async function updateCollection({ id, userId }, payload) {
  const [res] = await pool.execute(
    'UPDATE collections SET name = ? WHERE id = ? AND user_id = ?',
    [payload.name, id, userId],
  );

  if (!res.affectedRows) {
    throw new NotFoundError('Collection not found');
  }
}

export async function deleteCollection({ id, userId }) {
  const [res] = await pool.execute(
    'DELETE FROM collections WHERE id = ? AND user_id = ?',
    [id, userId],
  );

  if (!res.affectedRows) {
    throw new NotFoundError('Collection not found');
  }
}

export async function addCollectionItem(payload) {
  await pool.execute(
    'INSERT INTO collection_items (name, collection_id, user_id) VALUES (?, ?, ?)',
    [payload.name, payload.collectionId, payload.userId],
  );
}
