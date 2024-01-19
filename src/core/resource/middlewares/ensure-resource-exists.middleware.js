const {
  NotFoundException,
} = require('../../server/exceptions/not-found.exception');
const { parseGetOneQuery } = require('../helpers/parse-get-one-query');
const {
  createResourceAttributesQuery,
} = require('../queries/resource-attributes.query');
const {
  createResourceIncludeQuery,
} = require('../queries/resource-include.query');

exports.createEnsureResourceExists = function (resource) {
  return async (req, res, next) => {
    try {
      const query = parseGetOneQuery(req.query);

      const data = await resource.model.findByPk(req.params.id, {
        attributes: createResourceAttributesQuery(resource),
        include: createResourceIncludeQuery(resource, query),
      });

      if (data === null) {
        throw new NotFoundException();
      }

      req['resource'] = data;

      next();
    } catch (err) {
      next(err);
    }
  };
};
