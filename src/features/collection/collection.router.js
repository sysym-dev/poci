import { Router } from 'express';
import { handleRequest } from '../../middlewares/handle-request.middleware.js';
import { validateSchema } from '../../core/validation/validate-schema.js';
import { newSchema } from './schemas/new.schema.js';
import { editSchema } from './schemas/edit.schema.js';
import {
  findCollection,
  newCollection,
  updateCollection,
} from './collection.service.js';
import { requireAuth } from '../../middlewares/require-auth.middleware.js';

const router = Router();

router
  .route('/collections/new')
  .get(
    requireAuth,
    handleRequest((req, res) => res.render('collection/new')),
  )
  .post(
    requireAuth,
    validateSchema(newSchema, { redirect: '/collections/new' }),
    handleRequest(async (req, res) => {
      await newCollection({
        name: req.body.name,
        userId: req.auth.userId,
      });

      return res.redirect('/');
    }),
  );

router
  .route('/collections/:id/edit')
  .get(
    requireAuth,
    handleRequest(async (req, res) => {
      const collection = await findCollection({
        id: req.params.id,
        userId: req.auth.userId,
      });

      return res.render('collection/edit', { collection });
    }),
  )
  .post(
    requireAuth,
    validateSchema(editSchema),
    handleRequest(async (req, res) => {
      await updateCollection(
        { id: req.params.id, userId: req.auth.userId },
        req.body,
      );

      return res.redirect('/');
    }),
  );

export { router };
