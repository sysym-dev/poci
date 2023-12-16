const { Router } = require('express');
const {
  createRequestValidation,
} = require('./handler/create-request-validation.js');
const {
  createEnsureResourceExists,
} = require('./handler/ensure-resource-exists.js');
const { createDataResponse } = require('./handler/create-data-response.js');

exports.createResourcesRoute = function (resourceClasses) {
  const router = Router();

  resourceClasses.forEach((resourceClass) => {
    const resource = new resourceClass();

    router.get(
      `${resource.url}`,
      createDataResponse(async () => await resource.model.findAll()),
    );
    router.get(
      `${resource.url}/:id`,
      createEnsureResourceExists(resource),
      createDataResponse(({ req }) => req.resource),
    );
    router.post(
      `${resource.url}`,
      createRequestValidation(resource.schema({ isUpdating: false }), {
        path: 'body',
      }),
      createDataResponse(
        async ({ req }) => await resource.model.create(req.body),
      ),
    );
    router.patch(
      `${resource.url}/:id`,
      createEnsureResourceExists(resource),
      createRequestValidation(resource.schema({ isUpdating: true }), {
        path: 'body',
      }),
      createDataResponse(async ({ req }) => {
        await req.resource.update(req.body);

        return req.resource;
      }),
    );
    router.delete(
      `${resource.url}/:id`,
      createEnsureResourceExists(resource),
      createDataResponse(async ({ req }) => {
        await req.resource.destroy();

        return req.resource;
      }),
    );
  });

  return router;
};
