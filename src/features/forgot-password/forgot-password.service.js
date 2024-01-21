const dayjs = require('dayjs');
const {
  NotFoundException,
} = require('../../core/server/exceptions/not-found.exception');
const { randomToken } = require('../../core/utils/string');
const { User } = require('../user/model/user.model');
const { ForgotPassword } = require('./model/forgot-password.model');
const { Op } = require('sequelize');

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

    return await user.createForgotPassword({
      token: randomToken(),
      expiresIn: dayjs().add(1, 'hour'),
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
      include: ['User'],
    });

    if (!forgotPassword) {
      throw new NotFoundException('Token invalid');
    }

    await forgotPassword.User.update({
      password: body.password,
    });
    await forgotPassword.destroy();
  }
})();
