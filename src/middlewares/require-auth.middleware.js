export function requireAuth(req, res, next) {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }

  req.auth = { userId: req.session.userId };

  next();
}
