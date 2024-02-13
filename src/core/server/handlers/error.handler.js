const { HttpException } = require('../exceptions/http.exception');

exports.createErrorHandler = function () {
  return (err, req, res, next) => {
    if (err instanceof HttpException) {
      return res.status(err.status).json(err.toResponse());
    }

    return res.status(500).json({
      status: 500,
      name: 'Internal Server Error',
      message: err.message,
    });
  };
};
