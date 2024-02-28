import { Router } from 'express';
import { requireAuth } from '../../middlewares/require-auth.middleware.js';
import { handleRequest } from '../../middlewares/handle-request.middleware.js';
import { validateSchema } from '../../core/validation/validate-schema.js';
import { newTodayActivitySchema } from './schemas/new-today-activity.schema.js';
import {
  deleteActivity,
  findTodayActivity,
  newTodayActivity,
  updateTodayActivity,
} from './activity.service.js';
import { editTodayActivitySchema } from './schemas/edit-today-activity.schema.js';

const router = Router();

router
  .route('/today-activities/new')
  .get(
    requireAuth,
    handleRequest((req, res) =>
      res.render('activity/today/new', { title: 'New Activity' }),
    ),
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

router.get(
  '/activities/:id/delete',
  requireAuth,
  handleRequest(async (req, res) => {
    await deleteActivity({ id: req.params.id, userId: req.auth.userId });

    return res.redirect('/');
  }),
);

router
  .route('/today-activities/:id/edit')
  .get(
    requireAuth,
    handleRequest(async (req, res) => {
      const activity = await findTodayActivity({
        id: req.params.id,
        userId: req.auth.userId,
      });

      return res.render('activity/today/edit.pug', {
        title: 'Edit Activity',
        activity,
      });
    }),
  )
  .post(
    requireAuth,
    validateSchema(editTodayActivitySchema),
    handleRequest(async (req, res) => {
      await updateTodayActivity(
        { id: req.params.id, userId: req.auth.userId },
        { name: req.body.name },
      );

      return res.redirect('/');
    }),
  );

export { router };
