const {
  ResourceNotFoundException,
} = require('../exceptions/resource-not-found.exception');
const { parseGetOneQuery } = require('../helpers/parse-get-one-query');
const {
  createResourceAttributesQuery,
} = require('../query/create-resource-attributes-query');
const {
  createResourceIncludeQuery,
} = require('../query/create-resource-include-query');

exports.createEnsureResourceExists = function (resource) {
  return async (req, res, next) => {
    try {
      const query = parseGetOneQuery(req.query);

      const data = await resource.model.findByPk(req.params.id, {
        attributes: createResourceAttributesQuery(resource),
        include: createResourceIncludeQuery(resource, query),
      });

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
