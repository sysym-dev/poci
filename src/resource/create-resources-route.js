const { Router } = require('express');
const {
  createEnsureResourceExists,
} = require('./handlers/create-ensure-resource-exists.js');
const { createDataResponse } = require('./handlers/create-data-response.js');
const { parseGetAllQuery } = require('./helpers/parse-get-all-query.js');
const {
  createGetAllQueryValidation,
} = require('./handlers/create-get-all-query-validation.js');
const {
  createSchemaBodyValidation,
} = require('./handlers/create-schema-body-validation.js');

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
          include: query.include,
          attributes: resource.attributes(),
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
