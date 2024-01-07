const { User } = require('../user/model/user.model');
const jwt = require('jsonwebtoken');
const { config } = require('./auth.config');

class AuthService {
  async register(payload) {
    const user = await User.create({
      name: payload.name,
      email: payload.email,
      password: payload.password,
    });

    return await this.generateAuthResult(user);
  }

  async generateAuthResult(user) {
    const accessToken = await jwt.sign(
      {
        userId: user.id,
      },
      config.secret,
      { expiresIn: '15m' },
    );

    return {
      me: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
    };
  }
}

exports.AuthService = new AuthService();
