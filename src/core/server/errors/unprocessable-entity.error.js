import { ServerError } from './server.error.js';

export class UnprocessableEntityError extends ServerError {
  constructor(message, details) {
    super(message, 422, details);
  }

  render(req, res) {
    if (req.accepts('html', 'json') === 'json') {
      return res.status(422).json({
        status: this.status,
        message: this.message,
        details: this.details,
      });
    } else {
      res.flash('error', this.details[0].msg);

      return res.redirect(req.path);
    }
  }
}
