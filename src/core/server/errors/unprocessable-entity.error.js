import { ServerError } from './server.error.js';

export class UnprocessableEntityError extends ServerError {
  constructor(message, details) {
    super(message, 422, details);
  }

  renderHtml(req, res) {
    res.flash('error', this.details[0].msg);

    return res.redirect(req.path);
  }
}
