import 'dotenv/config.js';
import express from 'express';
import session from 'express-session';
import flash from 'express-flash-message';

import { router as indexRouter } from './src/features/index/index.router.js';
import { router as authRouter } from './src/features/auth/auth.router.js';
import { router as collectionRouter } from './src/features/collection/collection.router.js';

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

app.use(indexRouter);
app.use(authRouter);
app.use(collectionRouter);

app.listen(process.env.PORT, () => {
  console.log(`app listen at ${process.env.PORT}`);
});
