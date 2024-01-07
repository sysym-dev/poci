const { AuthService } = require('./auth.service.js');

exports.AuthController = class {
  async register({ body }) {
    return await AuthService.register(body);
  }
};
