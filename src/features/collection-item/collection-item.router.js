import { Router } from 'express';
import { requireAuth } from '../../middlewares/require-auth.middleware.js';
import { handleRequest } from '../../middlewares/handle-request.middleware.js';
import {
  addCollectionItemToTodayActvity,
  deleteCollectionItem,
  findCollectionItem,
  updateCollectionItem,
  updateCollectionItemIsDone,
} from './collection-item.service.js';
import { validateSchema } from '../../core/validation/validate-schema.js';
import { editSchema } from './schemas/edit.schema.js';
import { updateIsDoneSchema } from '../collection/schemas/update-is-done.schema.js';

const router = Router();

router
  .route('/collection-items/:id/edit')
  .get(
    requireAuth,
    handleRequest(async (req, res) => {
      const collectionItem = await findCollectionItem({
        id: req.params.id,
        userId: req.auth.userId,
        columns: ['id', 'name', 'description', 'collection_id'],
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

router.get(
  '/collection-items/:id/delete',
  requireAuth,
  handleRequest(async (req, res) => {
    const collectionItem = await findCollectionItem({
      id: req.params.id,
      userId: req.auth.userId,
    });

    await deleteCollectionItem({
      id: req.params.id,
      userId: req.auth.userId,
    });

    return res.redirect(`/collections/${collectionItem.collection_id}`);
  }),
);

router.patch(
  '/api/collection-items/:id/update-is-done',
  requireAuth,
  validateSchema(updateIsDoneSchema),
  handleRequest(async (req, res) => {
    await updateCollectionItemIsDone(
      {
        id: req.params.id,
        userId: req.auth.userId,
      },
      req.body.is_done,
    );

    return res.json('Ok');
  }),
);

router.get(
  '/collection-items/:id/add-to-today-activity',
  requireAuth,
  handleRequest(async (req, res) => {
    const collectionItem = await addCollectionItemToTodayActvity({
      id: req.params.id,
      userId: req.auth.userId,
    });

    return res.redirect(`/collections/${collectionItem.collection_id}`);
  }),
);

export { router };
