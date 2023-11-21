import Joi, { Schema } from 'joi';
import {
  RequestValidator,
  RequestValidatorPath,
  createRequestValidatorMiddleware,
} from './request-validator.middleware';
import { Handler } from 'express';
import { SortValues } from '../../db/repository/contract';
import { hasOwnProperty } from '../utils/object';
import { RouteContext } from '../router/route.context';

function parseSort(sort: string): SortValues {
  return Object.fromEntries(
    sort.split(',').map((column) => {
      const isDesc = column.charAt(0) === '-';
      return [isDesc ? column.slice(1) : column, isDesc ? 'desc' : 'asc'];
    }),
  );
}

export class ReadAllRequest extends RequestValidator {
  path: RequestValidatorPath = 'query';

  authorize(context: RouteContext): boolean {
    return true;
  }

  filter(): Joi.ObjectSchema {
    return Joi.object().optional();
  }

  schema(): Schema {
    return Joi.object({
      page: Joi.object({
        size: Joi.number().positive().optional(),
        number: Joi.number().positive().optional(),
      }).optional(),
      filter: this.filter(),
      sort: Joi.string().optional(),
    });
  }

  transform(values: Record<string, any>): Record<string, any> {
    return {
      ...values,
      ...(hasOwnProperty(values, 'sort')
        ? {
            sort: parseSort(values.sort),
          }
        : {}),
    };
  }
}

export function createReadAllResourceMiddleware(
  requestClass?: new () => ReadAllRequest,
): Handler {
  return createRequestValidatorMiddleware(requestClass ?? ReadAllRequest);
}
