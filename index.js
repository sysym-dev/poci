import 'dotenv/config.js';
import express from 'express';
import session from 'express-session';
import flash from 'express-flash-message';
import { validateSchema } from './src/core/validation/validate-schema.js';
import { loginSchema } from './src/features/auth/schemas/login.schema.js';
import { login } from './src/features/auth/auth.service.js';
import { AuthenticationError } from './src/features/auth/auth.error.js';

const app = express();

app.set('view engine', 'pug');

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'test',
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(
  flash({
    sessionKeyName: 'flash',
  }),
);

app.get('/login', (req, res) => {
  return res.render('login');
});
app.post('/login', [
  validateSchema(loginSchema, { redirect: '/login' }),
  async (req, res, next) => {
    try {
      const user = await login(req.body);

      return res.send(user);
    } catch (err) {
      if (err instanceof AuthenticationError) {
        res.flash('error', err.message);

        return res.redirect('/login');
      }

      next(err);
    }
  },
]);

app.listen(process.env.PORT, () => {
  console.log(`app listen at ${process.env.PORT}`);
});
