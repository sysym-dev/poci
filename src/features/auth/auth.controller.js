const { AuthService } = require('./auth.service.js');

exports.AuthController = class {
  async register({ body }) {
    return await AuthService.register(body);
  }
  async login({ body }) {
    return await AuthService.login(body);
  }
  async refreshToken({ body }) {
    return await AuthService.refreshToken(body.token);
  }
  async loginWithGoogle({ body }) {
    return await AuthService.loginWithGoogle(body.token);
  }
  async loginWithGithub({ body }) {
    return await AuthService.loginWithGithub(body.code);
  }
};
