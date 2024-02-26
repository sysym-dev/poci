export class ServerError extends Error {
  status = 500;
  details = null;

  constructor(message, status = 500, details = null) {
    super(message);

    this.status = status;
    this.details = details;
  }
}
