const dayjs = require('dayjs');
const { randomToken } = require('../../utils/string');

exports.EmailVerificationService = new (class {
  async createForUser(user, email) {
    const emailVerification = await user.getEmailVerification();

    if (emailVerification) {
      await emailVerification.destroy();
    }

    await user.createEmailVerification({
      email,
      token: randomToken(),
      expiresIn: dayjs().add(1, 'hour'),
    });
  }
})();
