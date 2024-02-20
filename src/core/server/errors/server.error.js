export class ServerError extends Error {
  code = 500;

  constructor(message, code = 500) {
    super(message);

    this.code = code;
  }
}
