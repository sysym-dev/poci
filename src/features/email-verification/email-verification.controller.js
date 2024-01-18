const { EmailVerificationService } = require('./email-verification.service');

exports.EmailVerificationController = class {
  async verify({ query }) {
    return await EmailVerificationService.verifyToken(query.token);
  }
};
