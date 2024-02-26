import { Router } from 'express';
import { requireAuth } from '../../middlewares/require-auth.middleware.js';
import { handleRequest } from '../../middlewares/handle-request.middleware.js';
import { validateSchema } from '../../core/validation/validate-schema.js';
import { newTodayActivitySchema } from './schemas/new-today-activity.schema.js';
import { newTodayActivity } from './activity.service.js';

const router = Router();

router
  .route('/today-activities/new')
  .get(
    requireAuth,
    handleRequest((req, res) => res.render('activity/new-today-activity')),
  )
  .post(
    requireAuth,
    validateSchema(newTodayActivitySchema),
    handleRequest(async (req, res) => {
      await newTodayActivity({
        name: req.body.name,
        userId: req.auth.userId,
      });

      return res.redirect('/');
    }),
  );

export { router };
