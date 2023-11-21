import Joi from 'joi';
import { HttpError } from '../../server/errors/http.error';
import { Handler } from 'express';
import { RouteContext } from '../router/route.context';
import { Request } from '../router/request/request';

export type RequestValidatorPath = 'params' | 'query' | 'body';

export abstract class RequestValidator {
  abstract authorize(context: RouteContext): Promise<boolean> | boolean;
  abstract schema(): Joi.Schema;

  transform(values: Record<string, any>): Record<string, any> {
    return values;
  }

  path: RequestValidatorPath = 'body';
}

export class AuthorizationError {}

export class ValidationError {
  public errors: Record<string, string>;

  constructor(errors: Joi.ValidationError) {
    this.errors = mapSchemaError(errors);
  }
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
    throw err instanceof Joi.ValidationError ? new ValidationError(err) : err;
  }
}

export function createRequestValidatorMiddleware(
  validatorClass: new () => RequestValidator,
): Handler {
  const validator = new validatorClass();

  return async (req: Request, res, next) => {
    try {
      const isAuthorized = await validator.authorize({
        body: req.body,
        params: req.params,
        query: req.query,
        user: req['user'],
      });

      if (!isAuthorized) {
        throw new AuthorizationError();
      }

      const validated = await validateRequest(validator, req[validator.path]);

      req[validator.path] = validated;

      next();
    } catch (err) {
      if (err instanceof ValidationError) {
        return next(
          new HttpError({
            name: 'Unprocessable Entity',
            message: 'Request Invalid',
            details: err.errors,
          }),
        );
      }

      if (err instanceof AuthorizationError) {
        return next(
          new HttpError({
            name: 'Forbidden',
            message: 'Forbidden',
          }),
        );
      }

      next(err);
    }
  };
}
