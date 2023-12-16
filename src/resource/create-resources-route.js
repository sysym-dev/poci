const { Router } = require('express');
const {
  ResourceNotFoundException,
} = require('./exceptions/resource-not-found.exception');
const {
  createRequestValidation,
} = require('./request/create-request-validation.js');
const {
  createEnsureResourceExists,
} = require('./request/ensure-resource-exists.js');

exports.createResourcesRoute = function (resourceClasses) {
  const router = Router();

  resourceClasses.forEach((resourceClass) => {
    const resource = new resourceClass();

    router.get(`${resource.url}`, async (req, res, next) => {
      try {
        return res.json({
          data: await resource.model.findAll(),
        });
      } catch (err) {
        return next(err);
      }
    });
    router.get(
      `${resource.url}/:id`,
      createEnsureResourceExists(resource),
      (req, res) => res.json({ data: req.resource }),
    );
    router.post(
      `${resource.url}`,
      createRequestValidation(resource.schema({ isUpdating: false }), {
        path: 'body',
      }),
      async (req, res, next) => {
        try {
          return res.json({ data: await resource.model.create(req.body) });
        } catch (err) {
          return next(err);
        }
      },
    );
    router.patch(
      `${resource.url}/:id`,
      createEnsureResourceExists(resource),
      createRequestValidation(resource.schema({ isUpdating: true }), {
        path: 'body',
      }),
      async (req, res, next) => {
        try {
          await req.resource.update(req.body);

          return res.json({ data: req.resource });
        } catch (err) {
          return next(err);
        }
      },
    );
    router.delete(
      `${resource.url}/:id`,
      createEnsureResourceExists(resource),
      async (req, res, next) => {
        try {
          await req.resource.destroy();

          return res.json({ data: req.resource });
        } catch (err) {
          return next(err);
        }
      },
    );
  });

  return router;
};
