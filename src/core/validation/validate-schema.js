import { validationResult, matchedData, checkSchema } from 'express-validator';

export function validateSchema(schema, options) {
  return [
    checkSchema(schema, ['body']),
    (req, res, next) => {
      const error = validationResult(req);

      if (!error.isEmpty()) {
        res.flash('error', error.array()[0].msg);

        return res.redirect(options?.redirect ?? req.path);
      }

      req.body = matchedData(req);

      next();
    },
  ];
}
