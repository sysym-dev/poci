const {
  UnprocessableEntityException,
} = require('../../server/exceptions/unprocessable-entity.exception');

exports.createExistsRule = function (options) {
  const model = options.model;
  const field = options.field;

  return async (value, helpers) => {
    if (!value) {
      return;
    }

    const exists = await model.count({
      where: {
        [field]: value,
        ...options.where,
      },
    });

    if (!exists) {
      throw new UnprocessableEntityException(null, {
        [helpers.state.path]:
          `${helpers.state.path} with value ${value} doesn't exists`,
      });
    }
  };
};
