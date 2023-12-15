const { Router } = require('express');

exports.createResourcesRoute = function (resourceClasses) {
  const router = Router();

  resourceClasses.forEach((resourceClass) => {
    const resource = new resourceClass();

    router.get(`${resource.url}`, async (req, res, next) => {
      try {
        const data = await resource.model.findAll();

        return res.json({
          data,
        });
      } catch (err) {
        return next(err);
      }
    });
    router.get(`${resource.url}/:id`, (req, res) =>
      res.json(`Detail ${resource.url}`),
    );
    router.post(`${resource.url}`, (req, res) =>
      res.json(`Create ${resource.url}`),
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
