exports.createErrorHandler = function () {
  return (err, req, res, next) => {
    return res.status(500).json({
      status: 500,
      name: 'Internal Server Error',
      message: err.message,
      details: err.details,
    });
  };
};
