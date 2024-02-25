import { pool } from '../../core/database/pool.js';
import { rowsMapper } from '../../core/database/utils/mapper.util.js';
import { NotFoundError } from '../../core/server/errors/not-found.error.js';

export async function readCollections({ userId }) {
  const [rows] = await pool.execute(
    `
      SELECT
        id,
        name
      FROM collections
      WHERE user_id = ?
      LIMIT 5
    `,
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
    `
      SELECT
        id, name
      FROM collections
      WHERE
        id = ?
        AND user_id = ?
    `,
    [id, userId],
  );

  if (!rows.length) {
    throw new NotFoundError('Collection not found');
  }

  return rows[0];
}

export async function findCollectionAndItems({ id, userId }) {
  const [rows] = await pool.execute(
    `
      SELECT
        collections.id AS collections_id,
        collections.name AS collections_name,
        collection_items.id AS collection_items_id,
        collection_items.name AS collection_items_name
      FROM collections
      LEFT JOIN collection_items
      ON collection_items.collection_id = collections.id
      WHERE
        collections.id = ?
        AND collections.user_id = ?
    `,
    [id, userId],
  );

  if (!rows.length) {
    throw new NotFoundError('Collection not found');
  }

  return rowsMapper(rows, {
    table: 'collections',
    columns: ['name'],
    relations: {
      items: {
        table: 'collection_items',
        columns: ['name'],
      },
    },
  })[0];
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

export async function isCollectionExists({ id, userId }) {
  const [res] = await pool.execute(
    'SELECT COUNT(*) AS count FROM collections WHERE id = ? AND user_id = ?',
    [id, userId],
  );
  const count = res[0].count;

  return count > 0;
}

export async function addCollectionItem(payload) {
  await pool.execute(
    'INSERT INTO collection_items (name, collection_id, user_id) VALUES (?, ?, ?)',
    [payload.name, payload.collectionId, payload.userId],
  );
}
