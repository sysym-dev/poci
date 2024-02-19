import { Router } from 'express';
import { handleRequest } from '../../middlewares/handle-request.middleware.js';
import { validateSchema } from '../../core/validation/validate-schema.js';
import { newSchma } from './schemas/new.schema.js';
import { newCollection } from './collection.service.js';
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
    validateSchema(newSchma, { redirect: '/collections/new' }),
    handleRequest(async (req, res) => {
      await newCollection({
        name: req.body.name,
        userId: req.auth.userId,
      });

      return res.redirect('/');
    }),
  );

export { router };
