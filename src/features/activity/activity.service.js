import dayjs from 'dayjs';
import { pool } from '../../core/database/pool.js';
import { NotFoundError } from '../../core/server/errors/not-found.error.js';

export async function newTodayActivity({ name, description, userId }) {
  const dueAt = dayjs().endOf('day').toDate();

  return await pool.execute(
    'INSERT INTO activities (name, description, due_at, user_id) VALUES (?, ?, ?, ?)',
    [name, description, dueAt, userId],
  );
}

export async function readTodayActivities({ userId }) {
  const today = dayjs();
  const [rows] = await pool.execute(
    `SELECT
      id, name, is_done
    FROM activities
    WHERE
      user_id = ?
      AND due_at >= ?
      AND due_at <= ?  
    `,
    [userId, today.startOf('day').toDate(), today.endOf('day').toDate()],
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

export async function findActivity({ id, userId, ...options }) {
  const columns = (options.columns ?? ['id', 'name']).join(', ');

  const [res] = await pool.execute(
    `SELECT ${columns} FROM activities WHERE id = ? AND user_id = ? LIMIT 1`,
    [id, userId],
  );

  if (!res.length) {
    throw new NotFoundError('Activity Not Found');
  }

  return res[0];
}

export async function findTodayActivity({ id, userId, ...options }) {
  const today = dayjs();
  const columns = (options.columns ?? ['id', 'name']).join(', ');

  const [res] = await pool.execute(
    `
      SELECT ${columns} FROM activities
      WHERE
        id = ?
        AND user_id = ?
        AND due_at >= ?
        AND due_at <= ?
      LIMIT 1
    `,
    [id, userId, today.startOf('day').toDate(), today.endOf('day').toDate()],
  );

  if (!res.length) {
    throw new NotFoundError('Activity Not Found');
  }

  return res[0];
}

export async function updateActivity({ id, userId }, { name, description }) {
  const [res] = await pool.execute(
    'UPDATE activities SET name = ?, description = ? WHERE id = ? AND user_id = ?',
    [name, description, id, userId],
  );

  if (!res.affectedRows) {
    throw new NotFoundError('Activity Not Found');
  }
}

export async function updateTodayActivityIsDone({ id, userId }, isDone) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const today = dayjs();
    const [activities] = await connection.execute(
      `
      SELECT id, collection_item_id
      FROM activities
      WHERE
        id = ?
        AND user_id = ?
        AND due_at >= ?
        AND due_at <= ?
    `,
      [id, userId, today.startOf('day').toDate(), today.endOf('day').toDate()],
    );

    if (!activities.length) {
      throw new NotFoundError('Activity Not Found');
    }

    const [activity] = activities;

    await connection.execute('UPDATE activities SET is_done = ? WHERE id = ?', [
      isDone,
      activity.id,
    ]);

    if (activity.collection_item_id) {
      await connection.execute(
        'UPDATE collection_items SET is_done = ? WHERE id = ?',
        [isDone, activity.collection_item_id],
      );
    }

    await connection.commit();
  } catch (err) {
    await connection.rollback();

    throw err;
  }
}

export async function getCountUnfinishedActivityYesterday({ userId }) {
  const yesterday = dayjs().subtract(1, 'day');

  const [res] = await pool.execute(
    `
    SELECT
      COUNT(*) AS count
    FROM activities
    WHERE
     user_id = ?
     AND is_done = 0
     AND is_dismissed = 0
     AND due_at >= ?
     AND due_at <= ?
  `,
    [
      userId,
      yesterday.startOf('day').toDate(),
      yesterday.endOf('day').toDate(),
    ],
  );

  return res[0].count;
}

export async function readUnfinishedActivityYesterday({ userId }) {
  const yesterday = dayjs().subtract(1, 'day');

  const [res] = await pool.execute(
    `
    SELECT id, name
    FROM activities
    WHERE
     user_id = ?
     AND is_done = 0
     AND is_dismissed = 0
     AND due_at >= ?
     AND due_at <= ?
  `,
    [
      userId,
      yesterday.startOf('day').toDate(),
      yesterday.endOf('day').toDate(),
    ],
  );

  return res;
}

export async function markUnfinishedYesterdayActivitiesAsDone({ userId }) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const yesterday = dayjs().subtract(1, 'day');

    const [unfinishedActivitieIdsYesterday] = await connection.execute(
      `
      SELECT id, collection_item_id
      FROM activities
      WHERE
        user_id = ?
        AND is_done = 0
        AND is_dismissed = 0
        AND due_at >= ?
        AND due_at <= ?
    `,
      [
        userId,
        yesterday.startOf('day').toDate(),
        yesterday.endOf('day').toDate(),
      ],
    );

    if (!unfinishedActivitieIdsYesterday.length) {
      return false;
    }

    const activitiesHasCollectionItem = unfinishedActivitieIdsYesterday.filter(
      (activity) => !!activity.collection_item_id,
    );

    if (activitiesHasCollectionItem.length) {
      await connection.execute(
        `
        UPDATE collection_items
        SET is_done = 1
        WHERE id IN (${activitiesHasCollectionItem.map(() => '?').join(', ')})
      `,
        activitiesHasCollectionItem.map((item) => item.collection_item_id),
      );
    }

    await connection.execute(
      `
      UPDATE activities
      SET is_done = 1
      WHERE id IN (${unfinishedActivitieIdsYesterday.map(() => '?').join(', ')})
    `,
      unfinishedActivitieIdsYesterday.map((item) => item.id),
    );

    await connection.commit();
  } catch (err) {
    await connection.rollback();

    throw err;
  }
}

export async function markUnfinishedYesterdayActivityAsDone({ id, userId }) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const yesterday = dayjs().subtract(1, 'day');

    const [activities] = await connection.execute(
      `
      SELECT
        id, collection_item_id
      FROM activities
      WHERE
        id = ?
        AND user_id = ?
        AND is_done = 0
        AND is_dismissed = 0
        AND due_at >= ?
        AND due_at <= ?
    `,
      [
        id,
        userId,
        yesterday.startOf('day').toDate(),
        yesterday.endOf('day').toDate(),
      ],
    );

    if (!activities.length) {
      throw new NotFoundError('Activity Not Found');
    }

    const [activity] = activities;

    await connection.execute('UPDATE activities SET is_done = 1 WHERE id = ?', [
      activity.id,
    ]);

    if (activity.collection_item_id) {
      await connection.execute(
        'UPDATE collection_items SET is_done = ? WHERE id = ?',
        [true, activity.collection_item_id],
      );
    }

    await connection.commit();
  } catch (err) {
    await connection.rollback();

    throw err;
  }
}

export async function extendUnfinishedYesterdayActivitiesToToday({ userId }) {
  const today = dayjs();
  const yesterday = dayjs().subtract(1, 'day');

  await pool.execute(
    `
    UPDATE activities
    SET due_at = ?
    WHERE
      user_id = ?
      AND is_done = 0
      AND is_dismissed = 0
      AND due_at >= ?
      AND due_at <= ?
  `,
    [
      today.endOf('day').toDate(),
      userId,
      yesterday.startOf('day').toDate(),
      yesterday.endOf('day').toDate(),
    ],
  );
}

export async function extendUnfinishedYesterdayActivitiyToToday({
  id,
  userId,
}) {
  const today = dayjs();
  const yesterday = today.subtract(1, 'day');

  const [res] = await pool.execute(
    `
    UPDATE activities
    SET due_at = ?
    WHERE
      id = ?
      AND user_id = ?
      AND is_done = 0
      AND is_dismissed = 0
      AND due_at >= ?
      AND due_at <= ?
  `,
    [
      today.endOf('day').toDate(),
      id,
      userId,
      yesterday.startOf('day').toDate(),
      yesterday.endOf('day').toDate(),
    ],
  );

  if (!res.affectedRows) {
    throw new NotFoundError('Activity Not Found');
  }
}

export async function dismissUnfinishedYesterdayActivity({ id, userId }) {
  const yesterday = dayjs().subtract(1, 'day');

  const [res] = await pool.execute(
    `
    UPDATE activities
    SET is_dismissed = 1
    WHERE
      id = ?
      AND user_id = ?
      AND is_done = 0
      AND is_dismissed = 0
      AND due_at >= ?
      AND due_at <= ?
  `,
    [
      id,
      userId,
      yesterday.startOf('day').toDate(),
      yesterday.endOf('day').toDate(),
    ],
  );

  if (!res.affectedRows) {
    throw new NotFoundError('Activity Not Found');
  }
}

export async function dismissUnfinishedYesterdayActivities({ userId }) {
  const yesterday = dayjs().subtract(1, 'day');

  await pool.execute(
    `
    UPDATE activities
    SET is_dismissed = 1
    WHERE
      user_id = ?
      AND is_done = 0
      AND is_dismissed = 0
      AND due_at >= ?
      AND due_at <= ?
  `,
    [
      userId,
      yesterday.startOf('day').toDate(),
      yesterday.endOf('day').toDate(),
    ],
  );
}
