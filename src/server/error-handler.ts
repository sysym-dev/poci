import { ErrorRequestHandler } from 'express';
import { HttpError } from './errors/http.error';

export function createErrorHandler(): ErrorRequestHandler {
  return (err: any, req, res, next) => {
    if (err instanceof HttpError) {
      return res.status(err.status).json(err);
    }

    console.log(err);

    const internalServerError = new HttpError({
      name: 'Internal Server Error',
      message: err?.message,
      details: err,
    });

    return res.status(internalServerError.status).json(internalServerError);
  };
}
