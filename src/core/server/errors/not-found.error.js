import { ServerError } from './server.error.js';

export class NotFoundError extends ServerError {
  constructor(message) {
    super(message, 404);
  }
}
