import 'dotenv/config.js';
import express from 'express';
import session from 'express-session';
import flash from 'express-flash-message';
import { validateSchema } from './src/core/validation/validate-schema.js';
import { loginSchema } from './src/features/auth/schemas/login.schema.js';
import { login } from './src/features/auth/auth.service.js';
import { AuthenticationError } from './src/features/auth/auth.error.js';
import { requireAuth } from './src/middlewares/require-auth.middleware.js';
import { requireGuest } from './src/middlewares/require-guest.middleware.js';
import { handleRequest } from './src/middlewares/handle-request.middleware.js';

const app = express();

app.set('view engine', 'pug');

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'test',
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(
  flash({
    sessionKeyName: 'flash',
  }),
);

app.get(
  '/',
  requireAuth,
  handleRequest((req, res) => {
    if (!req.session.isLoggedIn) {
      return res.redirect('/login');
    }

    return res.send(req.session.userId);
  }),
);
app.get('/login', requireGuest, (req, res) => {
  return res.render('login');
});
app.post('/login', [
  requireGuest,
  validateSchema(loginSchema, { redirect: '/login' }),
  handleRequest(async (req, res) => {
    try {
      const user = await login(req.body);

      req.session.isLoggedIn = true;
      req.session.userId = user.id;

      return res.redirect('/');
    } catch (err) {
      if (err instanceof AuthenticationError) {
        res.flash('error', err.message);

        return res.redirect('/login');
      }

      throw err;
    }
  }),
]);

app.listen(process.env.PORT, () => {
  console.log(`app listen at ${process.env.PORT}`);
});
