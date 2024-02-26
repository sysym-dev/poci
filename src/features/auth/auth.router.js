import { Router } from 'express';
import { validateSchema } from '../../core/validation/validate-schema.js';
import { loginSchema } from './schemas/login.schema.js';
import { login } from './auth.service.js';
import { AuthenticationError } from './auth.error.js';
import { requireGuest } from '../../middlewares/require-guest.middleware.js';
import { handleRequest } from '../../middlewares/handle-request.middleware.js';

const router = Router();

router
  .route('/login')
  .get(requireGuest, (req, res) => {
    return res.render('login', { title: 'Login' });
  })
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

export { router };
