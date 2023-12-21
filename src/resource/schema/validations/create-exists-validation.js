const {
  ResourceUnprocessableEntityException,
} = require('../../exceptions/resource-unprocessable-entity.exception');

exports.createExistsValidation = function (options) {
  const model = options.model;
  const field = options.field;

  return async (value, helpers) => {
    const exists = await model.count({
      [field]: value,
    });

    if (!exists) {
      throw new ResourceUnprocessableEntityException(null, {
        [helpers.state.path]:
          `${helpers.state.path} with value ${value} doesn't exists`,
      });
    }
  };
};
