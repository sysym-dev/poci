import { Router } from 'express';
import { handleRequest } from '../../middlewares/handle-request.middleware.js';
import { validateSchema } from '../../core/validation/validate-schema.js';
import { newSchema } from './schemas/new.schema.js';
import { editSchema } from './schemas/edit.schema.js';
import {
  addCollectionItem,
  deleteCollection,
  findCollection,
  findCollectionAndItems,
  isCollectionExists,
  newCollection,
  updateCollection,
} from './collection.service.js';
import { requireAuth } from '../../middlewares/require-auth.middleware.js';
import { newItemSchema } from './schemas/new-item.schema.js';
import { NotFoundError } from '../../core/server/errors/not-found.error.js';

const router = Router();

router
  .route('/collections/new')
  .get(
    requireAuth,
    handleRequest((req, res) =>
      res.render('collection/new', { title: 'New Collection' }),
    ),
  )
  .post(
    requireAuth,
    validateSchema(newSchema),
    handleRequest(async (req, res) => {
      await newCollection({
        name: req.body.name,
        userId: req.auth.userId,
      });

      return res.redirect('/');
    }),
  );

router.get(
  '/collections/:id',
  requireAuth,
  handleRequest(async (req, res) => {
    const collection = await findCollectionAndItems({
      id: req.params.id,
      userId: req.auth.userId,
    });

    return res.render('collection/view', {
      title: collection.name,
      collection,
    });
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

      return res.render('collection/edit', {
        title: 'Edit Collection',
        collection,
        from: req.query.from ?? '/',
      });
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

      return res.redirect(req.query.from ?? '/');
    }),
  );

router.get(
  '/collections/:id/delete',
  requireAuth,
  handleRequest(async (req, res) => {
    await deleteCollection({ id: req.params.id, userId: req.auth.userId });

    return res.redirect('/');
  }),
);

router
  .route('/collections/:id/items/new')
  .get(
    requireAuth,
    handleRequest(async (req, res) => {
      const collection = await findCollection({
        id: req.params.id,
        userId: req.auth.userId,
      });

      return res.render('collection-item/new', {
        title: 'New Collection Item',
        collection,
      });
    }),
  )
  .post(
    requireAuth,
    validateSchema(newItemSchema),
    handleRequest(async (req, res) => {
      if (
        !(await isCollectionExists({
          id: req.params.id,
          userId: req.auth.userId,
        }))
      ) {
        throw new NotFoundError('Collection not found');
      }

      await addCollectionItem({
        name: req.body.name,
        description: req.body.description,
        collectionId: req.params.id,
        userId: req.auth.userId,
      });

      return res.redirect(`/collections/${req.params.id}`);
    }),
  );

export { router };
