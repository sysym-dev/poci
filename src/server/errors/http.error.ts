import { ErrorPayload } from 'galat';
import { BaseError } from '../../app/errors/base-error';

export type HttpErrorNames =
  | 'Bad Request'
  | 'Unauthorized'
  | 'Forbidden'
  | 'Not Found'
  | 'Conflict'
  | 'Unprocessable Entity'
  | 'Internal Server Error';

export class HttpError extends BaseError<HttpErrorNames> {
  details: any;

  constructor(error: ErrorPayload<HttpErrorNames> & { details?: any }) {
    super(error);

    this.details = error.details;
  }

  statuses(): Record<HttpErrorNames, number> {
    return {
      'Bad Request': 400,
      Unauthorized: 401,
      Forbidden: 403,
      'Not Found': 404,
      Conflict: 409,
      'Unprocessable Entity': 422,
      'Internal Server Error': 500,
    };
  }
}
