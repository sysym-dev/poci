import { BaseError, ErrorPayload } from 'galat';

export type HttpErrorNames =
  | 'Bad Request'
  | 'Unauthorized'
  | 'Forbidden'
  | 'Not Found'
  | 'Conflict'
  | 'Unprocessable Entity'
  | 'Internal Server Error';

export class HttpError extends BaseError<HttpErrorNames> {
  status: number;
  details: any;

  constructor(error: ErrorPayload<HttpErrorNames> & { details?: any }) {
    super(error);

    this.details = error.details;

    this.setStatus();
  }

  private setStatus() {
    const errorNamesStatus: Record<HttpErrorNames, number> = {
      'Bad Request': 400,
      Unauthorized: 401,
      Forbidden: 403,
      'Not Found': 404,
      Conflict: 409,
      'Unprocessable Entity': 422,
      'Internal Server Error': 500,
    };

    this.status = errorNamesStatus[this.name];
  }
}
