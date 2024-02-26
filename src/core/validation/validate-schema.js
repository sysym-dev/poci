import { validationResult, matchedData, checkSchema } from 'express-validator';
import { UnprocessableEntityError } from '../server/errors/unprocessable-entity.error.js';

export function validateSchema(schema) {
  return [
    checkSchema(schema, ['body']),
    (req, res, next) => {
      const error = validationResult(req);

      if (!error.isEmpty()) {
        throw new UnprocessableEntityError(null, error.array());
      }

      req.body = matchedData(req);

      next();
    },
  ];
}
