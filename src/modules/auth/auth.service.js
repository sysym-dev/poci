const { User } = require('../user/model/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { config } = require('./auth.config');
const { AuthException } = require('./exceptions/auth.exception');
const {
  RefreshTokenService,
} = require('../../features/refresh-token/refresh-token.service');
const {
  NotFoundException,
} = require('../../server/exceptions/not-found.exception');

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

  async refreshToken(token) {
    try {
      const refreshTokenRow = await RefreshTokenService.findByToken(token);
      const user = await this.findUserById(refreshTokenRow.UserId);

      return {
        accessToken: await this.generateAccessToken(user),
      };
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new AuthException('Refresh token invalid');
      }

      throw err;
    }
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

  async findUserById(id) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new AuthException('User with the id is not found');
    }

    return user;
  }

  async verifyUserPassword(plain, user) {
    if (!(await bcrypt.compare(plain, user.password))) {
      throw new AuthException('Password incorrect');
    }
  }

  async generateAuthResult(user) {
    return {
      me: this.generateMe(user),
      token: await this.generateToken(user),
    };
  }

  async generateToken(user) {
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await RefreshTokenService.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken: refreshToken.token,
    };
  }

  async generateAccessToken(user) {
    {
      return await jwt.sign(
        {
          userId: user.id,
        },
        config.secret,
        { expiresIn: config.expiresIn },
      );
    }
  }

  generateMe(user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl,
    };
  }

  async verifyToken(token) {
    try {
      const payload = await jwt.verify(token, config.secret);
      const user = await this.findUserById(payload.userId);

      return user;
    } catch (err) {
      throw new AuthException(err.message);
    }
  }

  async updateMe(me, body) {
    await me.update(body);

    return this.generateMe(me);
  }

  async updatePassword(me, password) {
    await me.update({ password });
  }
}

exports.AuthService = new AuthService();
