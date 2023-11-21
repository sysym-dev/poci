import { BaseError as GalatError, ErrorPayload } from 'galat';

export abstract class BaseError<T extends string> extends GalatError<T> {
  status: number;

  abstract statuses(): Record<T, number>;

  constructor(error: ErrorPayload<T>) {
    super(error);

    this.setStatus();
  }

  private setStatus() {
    this.status = this.statuses()[this.name];
  }
}
