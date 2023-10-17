import Joi, { Schema } from 'joi';
import {
  RequestValidator,
  RequestValidatorPath,
  createRequestValidatorMiddleware,
} from './request-validator.middleware';
import { Handler } from 'express';
import { SortValues } from '../../db/repository/contract';
import { hasOwnProperty } from '../utils/object';

function parseSort(sort: string): SortValues {
  return Object.fromEntries(
    sort.split(',').map((column) => {
      const isDesc = column.charAt(0) === '-';
      return [isDesc ? column.slice(1) : column, isDesc ? 'desc' : 'asc'];
    }),
  );
}

class ReadAllRequest extends RequestValidator {
  path: RequestValidatorPath = 'query';

  authorize(): boolean {
    return true;
  }

  schema(): Schema {
    return Joi.object({
      page: Joi.object({
        size: Joi.number().positive().optional(),
        number: Joi.number().positive().optional(),
      }).optional(),
      filter: Joi.object().optional(),
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

export function createReadAllResourceMiddleware(): Handler {
  return createRequestValidatorMiddleware(ReadAllRequest);
}
