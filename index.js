import 'dotenv/config.js';
import express from 'express';
import session from 'express-session';
import flash from 'express-flash-message';
import { router as indexRouter } from './src/features/index/index.router.js';
import { router as authRouter } from './src/features/auth/auth.router.js';
import { router as collectionRouter } from './src/features/collection/collection.router.js';
import { ServerError } from './src/core/server/errors/server.error.js';

const app = express();

app.set('view engine', 'pug');
app.use('/public', express.static('public'));

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

app.use(indexRouter);
app.use(authRouter);
app.use(collectionRouter);

app.use((err, req, res, next) => {
  if (err instanceof ServerError) {
    return res.render(`error/${err.code}`);
  }

  console.log(err);

  return res.render('error/500');
});

app.listen(process.env.PORT, () => {
  console.log(`app listen at ${process.env.PORT}`);
});
