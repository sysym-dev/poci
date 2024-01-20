const { config } = require('../../core/app/app.config');
const { EmailVerificationService } = require('./email-verification.service');

exports.EmailVerificationController = class {
  async verify({ query, res }) {
    await EmailVerificationService.verifyToken(query.token);
  }
  async resend({ body }) {
    return await EmailVerificationService.resendEmail(body.email);
  }
};
