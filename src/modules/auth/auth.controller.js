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
};
