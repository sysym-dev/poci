const { Router } = require('express');
const {
  createRequestValidation,
} = require('./handlers/create-request-validation.js');
const {
  createEnsureResourceExists,
} = require('./handlers/create-ensure-resource-exists.js');
const { createDataResponse } = require('./handlers/create-data-response.js');
const { parseGetAllQuery } = require('./helpers/parse-get-all-query.js');
const {
  createGetAllQueryValidation,
} = require('./handlers/create-get-all-query-validation.js');

exports.createResourcesRoute = function (resourceClasses) {
  const router = Router();

  resourceClasses.forEach((resourceClass) => {
    const resource = new resourceClass();

    router.get(
      `${resource.url}`,
      createGetAllQueryValidation({
        filter: resource.filterables(),
      }),
      createDataResponse(async ({ req }) => {
        const query = parseGetAllQuery(req.query);

        const { count, rows } = await resource.model.findAndCountAll({
          where: resource.filter(query.filter),
          limit: query.page.size,
          offset: query.page.offset,
        });

        return {
          meta: {
            count,
            page: {
              size: query.page.size,
              number: query.page.number,
            },
          },
          rows,
        };
      }),
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
