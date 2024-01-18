const {
  UnprocessableEntityException,
} = require('../../server/exceptions/unprocessable-entity.exception');

exports.createUniqueRole = function (options) {
  const model = options.model;
  const field = options.field;

  return async (value, helpers) => {
    const exists = await model.count({
      where: {
        [field]: value,
      },
    });

    if (exists) {
      throw new UnprocessableEntityException(null, {
        [helpers.state.path]: `${helpers.state.path} already exists`,
      });
    }
  };
};
