import 'dotenv/config.js';
import express from 'express';
import session from 'express-session';
import flash from 'express-flash-message';
import { requireAuth } from './src/middlewares/require-auth.middleware.js';
import { handleRequest } from './src/middlewares/handle-request.middleware.js';
import { router as authRouter } from './src/features/auth/auth.router.js';

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

app.use(authRouter);

app.listen(process.env.PORT, () => {
  console.log(`app listen at ${process.env.PORT}`);
});
