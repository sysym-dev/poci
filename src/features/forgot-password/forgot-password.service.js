const dayjs = require('dayjs');
const {
  NotFoundException,
} = require('../../core/server/exceptions/not-found.exception');
const { randomToken } = require('../../core/utils/string');
const { User } = require('../user/model/user.model');

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
})();
