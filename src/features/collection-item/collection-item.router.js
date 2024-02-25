import { Router } from 'express';
import { requireAuth } from '../../middlewares/require-auth.middleware.js';
import { handleRequest } from '../../middlewares/handle-request.middleware.js';
import {
  findCollectionItem,
  updateCollectionItem,
} from './collection-item.service.js';
import { validateSchema } from '../../core/validation/validate-schema.js';
import { editSchema } from './schemas/edit.schema.js';

const router = Router();

router
  .route('/collection-items/:id/edit')
  .get(
    requireAuth,
    handleRequest(async (req, res) => {
      const collectionItem = await findCollectionItem({
        id: req.params.id,
        userId: req.auth.userId,
      });

      return res.render('collection-item/edit', {
        title: 'Edit Collection Item',
        collectionItem,
      });
    }),
  )
  .post(
    requireAuth,
    validateSchema(editSchema),
    handleRequest(async (req, res) => {
      const collectionItem = await findCollectionItem({
        id: req.params.id,
        userId: req.auth.userId,
      });

      await updateCollectionItem(
        {
          id: req.params.id,
          userId: req.auth.userId,
        },
        req.body,
      );

      return res.redirect(`/collections/${collectionItem.collection_id}`);
    }),
  );

export { router };
