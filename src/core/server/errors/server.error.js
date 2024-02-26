export class ServerError extends Error {
  status = 500;
  details = null;

  constructor(message, status = 500, details = null) {
    super(message);

    this.status = status;
    this.details = details;
  }

  render(req, res) {
    if (req.accepts('html', 'json') === 'json') {
      this.renderJson(req, res);
    } else {
      this.renderHtml(req, res);
    }
  }

  renderJson(req, res) {
    return res.status(this.status).json({
      status: this.status,
      message: this.message,
      details: this.details,
    });
  }

  renderHtml(req, res) {
    return res.status(this.status).render(`error/${this.status}`);
  }
}
