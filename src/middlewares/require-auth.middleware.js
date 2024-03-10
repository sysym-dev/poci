import { pool } from '../core/database/pool.js';

export async function requireAuth(req, res, next) {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }

  const [users] = await pool.execute(`SELECT id FROM users WHERE id = ?`, [
    req.session.userId,
  ]);

  if (!users.length) {
    req.session.isLoggedIn = false;
    req.userId = null;

    return res.redirect('/login');
  }

  req.auth = { userId: req.session.userId };

  next();
}
