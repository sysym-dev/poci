const dayjs = require('dayjs');
const path = require('path');
const {
  NotFoundException,
} = require('../../core/server/exceptions/not-found.exception');
const { randomToken } = require('../../core/utils/string');
const { User } = require('../user/model/user.model');
const { ForgotPassword } = require('./model/forgot-password.model');
const { Op } = require('sequelize');
const {
  sendResetPasswordLinkJob,
} = require('./jobs/send-reset-password-link.job');
const { generateClientUrl } = require('../../core/app/app.helper');

exports.ForgotPasswordService = new (class {
  async createByEmail(email) {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('User with the email is not found');
    }

    const existingForgotPassword = await user.getForgotPassword();

    if (existingForgotPassword) {
      await existingForgotPassword.destroy();
    }

    const forgotPassword = await user.createForgotPassword({
      token: randomToken(),
      expiresIn: dayjs().add(1, 'hour'),
    });

    await sendResetPasswordLinkJob.dispatch({
      data: {
        to: email,
        subject: 'Reset Password',
        views: path.resolve(__dirname, './mails/views/reset-password-link.pug'),
        data: {
          title: 'Reset Password',
          message: 'Click the button link below to reset your account password',
          actionText: 'Reset Password',
          actionUrl: generateClientUrl(
            `/reset-password?token=${forgotPassword.token}`,
          ),
        },
      },
    });
  }
  async resetPassword(body) {
    const forgotPassword = await ForgotPassword.findOne({
      where: {
        token: body.token,
        expiresIn: {
          [Op.gt]: new Date(),
        },
      },
      include: ['user'],
    });

    if (!forgotPassword) {
      throw new NotFoundException('Token invalid');
    }

    await forgotPassword.user.update({
      password: body.password,
    });
    await forgotPassword.destroy();
  }
})();
