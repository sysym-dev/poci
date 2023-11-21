import { db } from './db';

export async function connect() {
  try {
    await db.raw('SELECT 1');
  } catch (err) {
    throw err;
  }
}
