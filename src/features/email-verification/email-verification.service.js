const dayjs = require('dayjs');
const { randomToken } = require('../../core/utils/string');
const { EmailVerification } = require('./model/email-verification.model');
const { Op } = require('sequelize');
const path = require('path');
const { generateServerUrl } = require('../../core/app/app.helper');
const {
  sendEmailVerificationLinkJob,
} = require('./jobs/send-email-verification-link.job');
const {
  BadRequestException,
} = require('../../core/server/exceptions/bad-request.exception');

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
      include: ['user'],
    });

    if (!emailVerification) {
      throw new BadRequestException('Token not found');
    }

    await emailVerification.user.update({
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
      throw new BadRequestException('Email not found');
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
        views: path.resolve(
          __dirname,
          './mails/views/email-verification-link.pug',
        ),
        data: {
          title: 'Verify Your Email',
          message:
            'To confirm your registration or validate the recent email update, kindly click the verification link provided in this email.',
          actionText: 'Verify',
          actionUrl: generateServerUrl(
            `/email/verify?token=${emailVerification.token}`,
          ),
        },
      },
    });
  }
})();
