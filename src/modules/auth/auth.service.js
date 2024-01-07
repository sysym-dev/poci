const { User } = require('../user/model/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { config } = require('./auth.config');
const { AuthException } = require('./exceptions/auth.exception');

class AuthService {
  async register(payload) {
    const user = await User.create({
      name: payload.name,
      email: payload.email,
      password: payload.password,
    });

    return await this.generateAuthResult(user);
  }

  async login(payload) {
    const user = await this.findUserByEmail(payload.email);

    await this.verifyUserPassword(payload.password, user);

    return await this.generateAuthResult(user);
  }

  async findUserByEmail(email) {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new AuthException('User with the email is not found');
    }

    return user;
  }

  async verifyUserPassword(plain, user) {
    if (!(await bcrypt.compare(plain, user.password))) {
      throw new AuthException('Password incorrect');
    }
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
