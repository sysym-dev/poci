const { Router } = require('express');

exports.createRoutes = function (controllerClass, handler) {
  const router = Router();
  const controller = new controllerClass();

  handler({
    post(path, options) {
      router.post(path, options.middleware, async (req, res) => {
        const handler = controller[options.handler];
        const data = await handler({
          body: req.body,
        });

        return res.json({ data });
      });
    },
  });

  return router;
};
