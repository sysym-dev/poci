import { Router } from 'express';
import { handleRequest } from '../../middlewares/handle-request.middleware.js';
import { validateSchema } from '../../core/validation/validate-schema.js';
import { newSchma } from './schemas/new.schema.js';
import { newCollection } from './collection.service.js';

const router = Router();

router
  .route('/collections/new')
  .get(handleRequest((req, res) => res.render('collection/new')))
  .post(
    validateSchema(newSchma, { redirect: '/collections/new' }),
    handleRequest(async (req, res) => {
      await newCollection({
        name: req.body.name,
        userId: 1,
      });

      return res.redirect('/');
    }),
  );

export { router };
