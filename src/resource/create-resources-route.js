const { Router } = require('express');

exports.createResourcesRoute = function (resources) {
  const router = Router();

  resources.forEach((resource) => {
    router.get(`/${resource}`, (req, res) => res.json(`All ${resource}`));
    router.get(`/${resource}/:id`, (req, res) =>
      res.json(`Detail ${resource}`),
    );
    router.post(`/${resource}`, (req, res) => res.json(`Create ${resource}`));
    router.patch(`/${resource}/:id`, (req, res) =>
      res.json(`Update ${resource}`),
    );
    router.delete(`/${resource}/:id`, (req, res) =>
      res.json(`Delete ${resource}`),
    );
  });

  return router;
};
