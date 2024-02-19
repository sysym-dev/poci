import { Router } from 'express';
import { requireAuth } from '../../middlewares/require-auth.middleware.js';
import { handleRequest } from '../../middlewares/handle-request.middleware.js';
import { readCollections } from '../collection/collection.service.js';

const router = Router();

router.route('/').get(
  requireAuth,
  handleRequest(async (req, res) => {
    const collections = await readCollections({
      userId: 1,
    });

    return res.render('index', { collections });
  }),
);

export { router };
