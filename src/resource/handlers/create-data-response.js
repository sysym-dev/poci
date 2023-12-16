exports.createDataResponse = function (fn) {
  return async (req, res, next) => {
    try {
      return res.json({ data: await fn({ req }) });
    } catch (err) {
      return next(err);
    }
  };
};
