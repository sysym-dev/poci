import { Router } from 'express';
import { requireAuth } from '../../middlewares/require-auth.middleware.js';
import { handleRequest } from '../../middlewares/handle-request.middleware.js';
import { validateSchema } from '../../core/validation/validate-schema.js';
import { newTodayActivitySchema } from './schemas/new-today-activity.schema.js';
import {
  deleteActivity,
  findActivity,
  newTodayActivity,
  updateTodayActivityIsDone,
  updateActivity,
  readUnfinishedActivityYesterday,
  markUnfinishedYesterdayActivitiesAsDone,
  extendUnfinishedYesterdayActivitiesToToday,
  markUnfinishedYesterdayActivityAsDone,
  extendUnfinishedYesterdayActivitiyToToday,
  dismissUnfinishedYesterdayActivity,
  dismissUnfinishedYesterdayActivities,
  getCountUnfinishedActivityYesterday,
} from './activity.service.js';
import { editTodayActivitySchema } from './schemas/edit-today-activity.schema.js';
import { updateIsDoneSchema } from './schemas/update-is-done.schema.js';

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
      const activity = await findActivity({
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
      await updateActivity(
        { id: req.params.id, userId: req.auth.userId },
        { name: req.body.name },
      );

      return res.redirect('/');
    }),
  );

router.patch(
  '/api/activities/:id/update-is-done',
  requireAuth,
  validateSchema(updateIsDoneSchema),
  handleRequest(async (req, res) => {
    await updateTodayActivityIsDone(
      { id: req.params.id, userId: req.auth.userId },
      req.body.is_done,
    );

    return res.json('Ok');
  }),
);

router.get(
  '/yesterday-unfinished-activities',
  requireAuth,
  handleRequest(async (req, res) => {
    const countUnfinishedActivityYesterday =
      await getCountUnfinishedActivityYesterday({ userId: req.auth.userId });

    if (!countUnfinishedActivityYesterday) {
      return res.redirect('/');
    }

    return res.render('activity/yesterday/unfinished', {
      title: 'Unfinished Activities Yesterday',
      unfinishedActivities: await readUnfinishedActivityYesterday({
        userId: req.auth.userId,
      }),
    });
  }),
);

router.get(
  '/yesterday-unfinished-activities/mark-as-done',
  requireAuth,
  handleRequest(async (req, res) => {
    await markUnfinishedYesterdayActivitiesAsDone({ userId: req.auth.userId });

    return res.redirect('/');
  }),
);

router.get(
  '/yesterday-unfinished-activities/extend-to-today',
  requireAuth,
  handleRequest(async (req, res) => {
    await extendUnfinishedYesterdayActivitiesToToday({
      userId: req.auth.userId,
    });

    return res.redirect('/');
  }),
);

router.get(
  '/yesterday-unfinished-activities/dismiss',
  requireAuth,
  handleRequest(async (req, res) => {
    await dismissUnfinishedYesterdayActivities({
      userId: req.auth.userId,
    });

    return res.redirect('/');
  }),
);

router.get(
  '/yesterday-unfinished-activities/:id/mark-as-done',
  requireAuth,
  handleRequest(async (req, res) => {
    await markUnfinishedYesterdayActivityAsDone({
      id: req.params.id,
      userId: req.auth.userId,
    });

    return res.redirect('/yesterday-unfinished-activities');
  }),
);

router.get(
  '/yesterday-unfinished-activities/:id/extend-to-today',
  requireAuth,
  handleRequest(async (req, res) => {
    await extendUnfinishedYesterdayActivitiyToToday({
      id: req.params.id,
      userId: req.auth.userId,
    });

    return res.redirect('/yesterday-unfinished-activities');
  }),
);

router.get(
  '/yesterday-unfinished-activities/:id/dismiss',
  requireAuth,
  handleRequest(async (req, res) => {
    await dismissUnfinishedYesterdayActivity({
      id: req.params.id,
      userId: req.auth.userId,
    });

    return res.redirect('/yesterday-unfinished-activities');
  }),
);

export { router };
