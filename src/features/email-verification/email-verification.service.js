const dayjs = require('dayjs');
const { randomToken } = require('../../core/utils/string');
const { EmailVerification } = require('./model/email-verification.model');
const { Op } = require('sequelize');
const {
  NotFoundException,
} = require('../../core/server/exceptions/not-found.exception');
const path = require('path');
const { generateServerUrl } = require('../../core/app/app.helper');
const {
  sendEmailVerificationLinkJob,
} = require('./jobs/send-email-verification-link.job');

exports.EmailVerificationService = new (class {
  async createForUser(user, email) {
    const existingEmailVerification = await user.getEmailVerification();

    if (existingEmailVerification) {
      await existingEmailVerification.destroy();
    }

    const emailVerification = await user.createEmailVerification({
      email,
      token: randomToken(),
      expiresIn: dayjs().add(1, 'hour'),
    });
    await this.sendEmailVerificationLink(emailVerification);
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

    await this.sendEmailVerificationLink(emailVerification);
  }
  async sendEmailVerificationLink(emailVerification) {
    await sendEmailVerificationLinkJob.dispatch({
      data: {
        to: emailVerification.email,
        subject: 'Verify Your Email',
        views: path.resolve(__dirname, './mails/views/verification-link.pug'),
        data: {
          url: generateServerUrl(
            `/email/verify?token=${emailVerification.token}`,
          ),
        },
        job: {
          name: 'SendEmailVerificationLink',
        },
      },
    });
  }
})();
