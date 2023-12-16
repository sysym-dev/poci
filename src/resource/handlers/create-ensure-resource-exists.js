const {
  ResourceNotFoundException,
} = require('../exceptions/resource-not-found.exception');

exports.createEnsureResourceExists = function (resource) {
  return async (req, res, next) => {
    try {
      const data = await resource.model.findByPk(req.params.id);

      if (data === null) {
        throw new ResourceNotFoundException();
      }

      req['resource'] = data;

      next();
    } catch (err) {
      next(err);
    }
  };
};
