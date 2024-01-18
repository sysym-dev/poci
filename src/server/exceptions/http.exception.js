const {
  HttpException: CoreHttpException,
} = require('../../core/server/exceptions/http.exception');

exports.HttpException = class extends CoreHttpException {};
