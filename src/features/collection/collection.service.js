import { pool } from '../../core/database/pool.js';
import { rowsMapper } from '../../core/database/utils/mapper.util.js';
import { NotFoundError } from '../../core/server/errors/not-found.error.js';

export async function readCollections({ userId }) {
  const [collections] = await pool.execute(
    `
      SELECT
        collections.id AS collections_id,
        collections.name AS collections_name,
        collection_items.id AS collection_items_id,
        collection_items.name AS collection_items_name
      FROM collections
      LEFT JOIN (
        SELECT
          id,
          name,
          collection_id,
          ROW_NUMBER() OVER(PARTITION BY collection_id ORDER BY id) AS row_num
        FROM collection_items
      ) AS collection_items
      ON
        collection_items.collection_id = collections.id
        AND collection_items.row_num <= 5
      WHERE user_id = ?
      ORDER BY collections_id, collection_items_id
      LIMIT 25
    `,
    [userId],
  );

  return rowsMapper(collections, {
    table: 'collections',
    columns: ['name'],
    relations: {
      items: {
        table: 'collection_items',
        columns: ['name'],
      },
    },
  });
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
