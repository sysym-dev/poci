const {
  EmailVerificationService,
} = require('../../features/email-verification/email-verification.service');

class MeService {
  generateMe(user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      photo_url: user.photoUrl,
      is_email_verified: user.isEmailVerified,
    };
  }

  async updateMe(me, body) {
    await me.update(body);

    return this.generateMe(me);
  }

  async updateEmail(me, email) {
    await EmailVerificationService.createForUser(me, email);
  }

  async updatePassword(me, password) {
    await me.update({ password });
  }
}

exports.MeService = new MeService();
