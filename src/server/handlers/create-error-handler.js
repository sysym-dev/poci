const {
  ResourceException,
} = require('../../resource/exceptions/resource.exception');

exports.createErrorHandler = function () {
  return (err, req, res, next) => {
    if (err instanceof ResourceException) {
      return res.status(err.status).json({
        status: err.status,
        name: err.name,
        message: err.message,
        details: err.details,
      });
    }

    return res.status(500).json({
      status: 500,
      name: 'Internal Server Error',
      message: err.message,
    });
  };
};
