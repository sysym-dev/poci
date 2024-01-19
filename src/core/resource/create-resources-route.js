const { Router } = require('express');
const {
  createEnsureResourceExists,
} = require('./middlewares/ensure-resource-exists.middleware.js');
const {
  createDataResponse,
} = require('../server/handlers/data-response.handler.js');
const { parseGetAllQuery } = require('./helpers/parse-get-all-query.js');
const {
  createGetAllQueryValidation,
} = require('./middlewares/get-all-query-validation.middleware.js');
const {
  createGetOneQueryValidation,
} = require('./middlewares/get-one-query-validation.middleware.js');
const {
  createSchemaBodyValidation,
} = require('./middlewares/schema-body-validation.middleware.js');
const {
  createResourceAttributesQuery,
} = require('./queries/resource-attributes.query.js');
const {
  createResourceIncludeQuery,
} = require('./queries/resource-include.query.js');

exports.createResourcesRoute = function (resourceClasses) {
  const router = Router();

  resourceClasses.forEach((resourceClass) => {
    const resource = new resourceClass();

    router.get(
      `${resource.url}`,
      createGetAllQueryValidation({
        filterables: resource.filterables(),
        sortables: resource.sortables(),
        relations: resource.relations ? resource.relations() : [],
      }),
      createDataResponse(async ({ req }) => {
        const query = parseGetAllQuery(req.query);

        const { count, rows } = await resource.model.findAndCountAll({
          where: resource.filter(query.filter),
          limit: query.page.size,
          offset: query.page.offset,
          order: [query.sort],
          include: createResourceIncludeQuery(resource, query),
          attributes: createResourceAttributesQuery(resource, query),
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
      createGetOneQueryValidation({
        relations: resource.relations ? resource.relations() : [],
      }),
      createEnsureResourceExists(resource),
      createDataResponse(({ req }) => req.resource),
    );
    router.post(
      `${resource.url}`,
      createSchemaBodyValidation(resource.schema({ isUpdating: false })),
      createDataResponse(
        async ({ req }) => await resource.model.create(req.body),
      ),
    );
    router.patch(
      `${resource.url}/:id`,
      createEnsureResourceExists(resource),
      createSchemaBodyValidation(resource.schema({ isUpdating: true })),
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
