const { EmailVerificationService } = require('./email-verification.service');

exports.EmailVerificationController = class {
  async verify({ query }) {
    return await EmailVerificationService.verifyToken(query.token);
  }
  async resend({ body }) {
    return await EmailVerificationService.resendEmail(body.email);
  }
};
