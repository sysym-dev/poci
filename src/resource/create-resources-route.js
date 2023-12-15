const { Router } = require('express');
const {
  ResourceNotFoundException,
} = require('./exceptions/resource-not-found.exception');
const {
  createRequestValidation,
} = require('./request/create-request-validation.js');

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
    router.get(`${resource.url}/:id`, async (req, res, next) => {
      try {
        const data = await resource.model.findByPk(req.params.id);

        if (data === null) {
          throw new ResourceNotFoundException();
        }

        return res.json({
          data,
        });
      } catch (err) {
        return next(err);
      }
    });
    router.post(
      `${resource.url}`,
      createRequestValidation(resource.schema, { path: 'body' }),
      async (req, res, next) => {
        try {
          return res.json({ data: await resource.model.create(req.body) });
        } catch (err) {
          return next(err);
        }
      },
    );
    router.patch(`${resource.url}/:id`, (req, res) =>
      res.json(`Update ${resource.url}`),
    );
    router.delete(`${resource.url}/:id`, (req, res) =>
      res.json(`Delete ${resource.url}`),
    );
  });

  return router;
};
