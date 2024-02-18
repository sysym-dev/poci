export function requireGuest(req, res, next) {
  if (req.session.isLoggedIn) {
    return res.redirect('/');
  }

  next();
}
