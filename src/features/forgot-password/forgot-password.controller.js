const { ForgotPasswordService } = require('./forgot-password.service');

exports.ForgotPasswordController = class {
  async forgotPassword({ body }) {
    await ForgotPasswordService.createByEmail(body.email);
  }
};
