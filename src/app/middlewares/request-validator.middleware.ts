import Joi from 'joi';
import { HttpError } from '../../server/errors/http.error';
import { Handler } from 'express';

export type RequestValidatorPath = 'params' | 'query' | 'body';

export abstract class RequestValidator {
  abstract authorize(): boolean;
  abstract schema(): Joi.Schema;

  transform(values: Record<string, any>): Record<string, any> {
    return values;
  }

  path: RequestValidatorPath = 'body';
}

export function mapSchemaError(
  err: Joi.ValidationError,
): Record<string, string> {
  return Object.fromEntries(
    err.details.map((field) => [field.path, field.message]),
  );
}

export async function validateRequest<T = Record<string, any>>(
  validator: RequestValidator,
  values: Record<string, any>,
): Promise<T> {
  try {
    const validated = await validator.schema().validateAsync(values, {
      convert: true,
    });

    return validator.transform(validated) as T;
  } catch (err) {
    throw err instanceof Joi.ValidationError ? mapSchemaError(err) : err;
  }
}

export function createRequestValidatorMiddleware(
  validatorClass: new () => RequestValidator,
): Handler {
  const validator = new validatorClass();

  return async (req, res, next) => {
    try {
      const validated = await validateRequest(validator, req[validator.path]);

      req[validator.path] = validated;

      next();
    } catch (err) {
      next(
        new HttpError({
          name: 'Unprocessable Entity',
          message: 'Request Invalid',
          details: err,
        }),
      );
    }
  };
}
