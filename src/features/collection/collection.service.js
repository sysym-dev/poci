import { pool } from '../../core/database/pool.js';
import { NotFoundError } from '../../core/server/errors/not-found.error.js';

function columnMapper(table, columns, attribute) {
  return Object.fromEntries(
    columns.map((column) => {
      return [column, attribute[`${table}_${column}`]];
    }),
  );
}
function rowsMapper(rows, options) {
  return rows.reduce((carry, item) => {
    const itemId = item[`${options.table}_id`];
    const itemIndexInCarry = carry.findIndex((carryItem) => {
      return carryItem.id === itemId;
    });

    if (itemIndexInCarry === -1) {
      const itemRelations = Object.fromEntries(
        Object.entries(options.relations).map(([name, relation]) => {
          const relationId = item[`${relation.table}_id`];

          return [
            name,
            relationId
              ? [
                  {
                    id: relationId,
                    ...columnMapper(relation.table, relation.columns, item),
                  },
                ]
              : [],
          ];
        }),
      );

      return [
        ...carry,
        {
          id: itemId,
          ...columnMapper(options.table, options.columns, item),
          ...itemRelations,
        },
      ];
    }

    const itemRelations = Object.fromEntries(
      Object.entries(options.relations).map(([name, relation]) => {
        const relationId = item[`${relation.table}_id`];

        return [
          name,
          [
            ...carry[itemIndexInCarry][name],
            {
              id: relationId,
              ...columnMapper(relation.table, relation.columns, item),
            },
          ],
        ];
      }),
    );

    carry[itemIndexInCarry] = {
      ...carry[itemIndexInCarry],
      ...itemRelations,
    };

    return carry;
  }, []);
}

export async function readCollections({ userId }) {
  const [rows] = await pool.execute(
    `
      SELECT
        collections.id collections_id,
        collections.name collections_name,
        collection_items.id collection_items_id,
        collection_items.name collection_items_name
      FROM collections
      LEFT JOIN collection_items
      ON collection_items.collection_id = collections.id
      WHERE collections.user_id = ?
    `,
    [userId],
  );

  return rowsMapper(rows, {
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
