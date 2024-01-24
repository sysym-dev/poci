exports.createDataResponse = function (fn) {
  return async (req, res, next) => {
    try {
      return res.json({ data: await fn({ req, me: req.me }) });
    } catch (err) {
      return next(err);
    }
  };
};
