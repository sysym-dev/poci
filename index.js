import 'dotenv/config.js';
import express from 'express';
import session from 'express-session';
import flash from 'express-flash-message';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import { router as indexRouter } from './src/features/index/index.router.js';
import { router as authRouter } from './src/features/auth/auth.router.js';
import { router as collectionRouter } from './src/features/collection/collection.router.js';
import { router as collectionItemRouter } from './src/features/collection-item/collection-item.router.js';
import { router as activityRouter } from './src/features/activity/activity.router.js';
import { ServerError } from './src/core/server/errors/server.error.js';

try {
  const redisClient = createClient();

  await redisClient.connect();

  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'poci:',
  });

  const app = express();

  app.set('view engine', 'pug');
  app.use('/public', express.static('public'));

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(
    session({
      store: redisStore,
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
  app.use(collectionItemRouter);
  app.use(activityRouter);

  app.use((err, req, res, next) => {
    if (err instanceof ServerError) {
      return err.render(req, res);
    }

    console.log(err);

    return new ServerError().render(req, res);
  });

  app.listen(process.env.PORT, () => {
    console.log(`app listen at ${process.env.PORT}`);
  });
} catch (err) {
  console.error(err);

  process.exit(1);
}
