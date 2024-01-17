const { AuthService } = require('./auth.service.js');

exports.AuthController = class {
  async register({ body }) {
    return await AuthService.register(body);
  }
  async login({ body }) {
    return await AuthService.login(body);
  }
  me({ me }) {
    return AuthService.generateMe(me);
  }
  async updateMe({ body, me }) {
    return await AuthService.updateMe(me, body);
  }
  async updatePassword({ body, me }) {
    await AuthService.updatePassword(me, body.password);
  }
  async updatePhoto({ file, me }) {
    return await AuthService.updateMe(me, {
      photoFilename: file.uploadedName,
    });
  }
  async updateEmail({ body, me }) {
    await AuthService.updateMe(me, body);
  }
  async refreshToken({ body }) {
    return await AuthService.refreshToken(body.token);
  }
};
