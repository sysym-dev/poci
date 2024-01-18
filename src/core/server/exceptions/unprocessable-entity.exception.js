const { HttpException } = require('./http.exception');

exports.UnprocessableEntityException = class extends HttpException {};
