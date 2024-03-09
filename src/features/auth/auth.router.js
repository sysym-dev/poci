import { Router } from 'express';
import { validateSchema } from '../../core/validation/validate-schema.js';
import { loginSchema } from './schemas/login.schema.js';
import { login, register } from './auth.service.js';
import { AuthenticationError } from './auth.error.js';
import { requireGuest } from '../../middlewares/require-guest.middleware.js';
import { handleRequest } from '../../middlewares/handle-request.middleware.js';
import { registerSchema } from './schemas/register.schema.js';
import { requireAuth } from '../../middlewares/require-auth.middleware.js';

const router = Router();

router
  .route('/login')
  .get(
    requireGuest,
    handleRequest((req, res) => {
      return res.render('login', { title: 'Login' });
    }),
  )
  .post([
    requireGuest,
    validateSchema(loginSchema),
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

router
  .route('/register')
  .get(
    requireGuest,
    handleRequest((req, res) => {
      return res.render('register', { title: 'Register' });
    }),
  )
  .post([
    requireGuest,
    validateSchema(registerSchema),
    handleRequest(async (req, res) => {
      try {
        const user = await register({
          email: req.body.email,
          password: req.body.password,
        });

        req.session.isLoggedIn = true;
        req.session.userId = user.id;

        return res.redirect('/');
      } catch (err) {
        if (err instanceof AuthenticationError) {
          res.flash('error', err.message);

          return res.redirect('/register');
        }

        throw err;
      }
    }),
  ]);

router.route('/logout').get(
  requireAuth,
  handleRequest(async (req, res) => {
    req.session.isLoggedIn = false;
    req.session.userId = null;

    return res.redirect('/');
  }),
);

export { router };
