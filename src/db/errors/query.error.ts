import { BaseError } from '../../app/errors/base-error';

export class QueryError extends BaseError<'RowNotFound'> {
  statuses(): Record<'RowNotFound', number> {
    return {
      RowNotFound: 404,
    };
  }
}
