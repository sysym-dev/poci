const { Router } = require('express');

exports.createRouter = function (controllerClass, handler) {
  const router = Router();
  const controller = new controllerClass();

  handler({
    post(path, options) {
      router.post(path, options.middleware, async (req, res, next) => {
        try {
          const handler = controller[options.handler];
          const data = await handler({
            body: req.body,
          });

          return res.json({ data });
        } catch (err) {
          return next(err);
        }
      });
    },
    get(path, options) {
      router.get(path, options.middleware, async (req, res, next) => {
        try {
          const handler = controller[options.handler];
          const data = await handler({
            body: req.body,
            me: req.me,
            query: req.query,
            res,
          });

          if (options.redirect) {
            return res.redirect(options.redirect);
          }

          return res.json({ data });
        } catch (err) {
          return next(err);
        }
      });
    },
    patch(path, options) {
      router.patch(path, options.middleware, async (req, res, next) => {
        try {
          const handler = controller[options.handler];
          const data = await handler({
            body: req.body,
            me: req.me,
            file: req.file,
          });

          return res.json({ data });
        } catch (err) {
          return next(err);
        }
      });
    },
  });

  return router;
};
