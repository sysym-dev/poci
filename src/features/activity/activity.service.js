import dayjs from 'dayjs';
import { pool } from '../../core/database/pool.js';
import { NotFoundError } from '../../core/server/errors/not-found.error.js';
import { updateCollectionItemIsDone } from '../collection-item/collection-item.service.js';

export async function newTodayActivity({ name, userId }) {
  const dueAt = dayjs().endOf('day').toDate();

  return await pool.execute(
    'INSERT INTO activities (name, due_at, user_id) VALUES (?, ?, ?)',
    [name, dueAt, userId],
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

export async function updateActivity({ id, userId }, { name }) {
  const [res] = await pool.execute(
    'UPDATE activities SET name = ? WHERE id = ? AND user_id = ?',
    [name, id, userId],
  );

  if (!res.affectedRows) {
    throw new NotFoundError('Activity Not Found');
  }
}

export async function updateTodayActivityIsDone({ id, userId }, isDone) {
  const activity = await findTodayActivity({
    id,
    userId,
    columns: ['id', 'collection_item_id'],
  });

  await pool.execute('UPDATE activities SET is_done = ? WHERE id = ?', [
    isDone,
    activity.id,
  ]);

  if (activity.collection_item_id) {
    await updateCollectionItemIsDone(
      { id: activity.collection_item_id, userId },
      isDone,
    );
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
  const yesterday = dayjs().subtract(1, 'day');

  const [unfinishedActivitieIdsYesterday] = await pool.execute(
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
    await pool.execute(
      `
      UPDATE collection_items
      SET is_done = 1
      WHERE id IN (${activitiesHasCollectionItem.map(() => '?').join(', ')})
    `,
      activitiesHasCollectionItem.map((item) => item.collection_item_id),
    );
  }

  await pool.execute(
    `
    UPDATE activities
    SET is_done = 1
    WHERE id IN (${unfinishedActivitieIdsYesterday.map(() => '?').join(', ')})
  `,
    unfinishedActivitieIdsYesterday.map((item) => item.id),
  );
}

export async function markUnfinishedYesterdayActivityAsDone({ id, userId }) {
  const yesterday = dayjs().subtract(1, 'day');

  const [activities] = await pool.execute(
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

  await pool.execute('UPDATE activities SET is_done = 1 WHERE id = ?', [
    activity.id,
  ]);

  if (activity.collection_item_id) {
    await updateCollectionItemIsDone(
      { id: activity.collection_item_id, userId },
      true,
    );
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
