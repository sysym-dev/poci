import { Router } from 'express';
import { requireAuth } from '../../middlewares/require-auth.middleware.js';
import { handleRequest } from '../../middlewares/handle-request.middleware.js';
import { readCollections } from '../collection/collection.service.js';
import { readActivities } from '../activity/activity.service.js';

const router = Router();

router.route('/').get(
  requireAuth,
  handleRequest(async (req, res) => {
    const collections = await readCollections({
      userId: req.auth.userId,
    });
    const activities = await readActivities({
      userId: req.auth.userId,
    });

    return res.render('index', { title: 'Home', collections, activities });
  }),
);

export { router };
