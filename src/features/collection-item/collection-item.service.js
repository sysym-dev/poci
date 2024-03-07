import dayjs from 'dayjs';
import { pool } from '../../core/database/pool.js';
import { NotFoundError } from '../../core/server/errors/not-found.error.js';

export async function findCollectionItem({ id, userId, ...options }) {
  const columns = (
    options.columns ?? ['id', 'name', 'collection_id', 'user_id']
  ).join(', ');

  const [rows] = await pool.execute(
    `SELECT ${columns} FROM collection_items WHERE id = ? AND user_id = ?`,
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
        SET
          name = ?,
          description = ?
        WHERE
            id = ?
            AND user_id = ?
    `,
    [payload.name, payload.description, id, userId],
  );

  if (!res.affectedRows) {
    throw new NotFoundError('Collection item not found');
  }
}

export async function updateCollectionItemIsDone({ id, userId }, isDone) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [res] = await connection.execute(
      `UPDATE collection_items SET is_done = ? WHERE id = ? AND user_id = ?`,
      [isDone, id, userId],
    );

    if (!res.affectedRows) {
      throw new NotFoundError('Collection item not found');
    }

    await connection.execute(
      'UPDATE activities SET is_done = ? WHERE collection_item_id = ?',
      [isDone, id],
    );

    await connection.commit();
  } catch (err) {
    await connection.rollback();

    throw err;
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

export async function addCollectionItemToTodayActvity({ id, userId }) {
  const today = dayjs();
  const yesterday = today.subtract(1, 'day');

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [res] = await connection.execute(
      `
      SELECT
        id,
        name,
        user_id,
        collection_id,
        is_done,
        (
          SELECT COUNT(*)
          FROM activities
          WHERE
            activities.collection_item_id = collection_items.id
            AND due_at >= ?
            AND due_at <= ?
        ) count_yesterday_activities
      FROM collection_items
      WHERE
        id = ?
        AND user_id = ?
        AND NOT EXISTS (
          SELECT * FROM activities
          WHERE
            activities.collection_item_id = collection_items.id
            AND due_at >= ?
            AND due_at <= ?
        )
      LIMIT 1
    `,
      [
        yesterday.startOf('day').toDate(),
        yesterday.endOf('day').toDate(),
        id,
        userId,
        today.startOf('day').toDate(),
        today.endOf('day').toDate(),
      ],
    );

    if (!res.length) {
      throw new NotFoundError(
        'Collection item not found or already added to activity',
      );
    }

    const [collectionItem] = res;

    await connection.execute(
      `
      INSERT INTO activities
        (name, user_id, due_at, collection_item_id, is_done)
      VALUES
        (?, ?, ?, ?, ?)
    `,
      [
        collectionItem.name,
        collectionItem.user_id,
        today.endOf('day').toDate(),
        collectionItem.id,
        collectionItem.is_done,
      ],
    );

    if (collectionItem.count_yesterday_activities) {
      await connection.execute(
        `
        UPDATE activities
        SET is_dismissed = 1
        WHERE
          collection_item_id = ?
          AND due_at >= ?
          AND due_at <= ?
      `,
        [
          collectionItem.id,
          yesterday.startOf('day').toDate(),
          yesterday.endOf('day').toDate(),
        ],
      );
    }

    await connection.commit();

    return collectionItem;
  } catch (err) {
    await connection.rollback();

    throw err;
  }
}
