const dayjs = require('dayjs');
const { randomToken } = require('../../core/utils/string');
const { EmailVerification } = require('./model/email-verification.model');
const { Op } = require('sequelize');
const {
  NotFoundException,
} = require('../../core/server/exceptions/not-found.exception');

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
  async verifyToken(token) {
    const emailVerification = await EmailVerification.findOne({
      where: {
        token,
        expiresIn: {
          [Op.gt]: new Date(),
        },
      },
      include: ['User'],
    });

    if (!emailVerification) {
      throw new NotFoundException('Token invalid');
    }

    await emailVerification.User.update({
      email: emailVerification.email,
      emailVerifiedAt: new Date(),
    });
    await emailVerification.destroy();
  }
  async resendEmail(email) {
    const emailVerification = await EmailVerification.findOne({
      where: {
        email,
      },
    });

    if (!emailVerification) {
      throw new NotFoundException('Email invalid');
    }

    await emailVerification.update({
      token: randomToken(),
      expiresIn: dayjs().add(1, 'hour'),
    });
  }
})();
