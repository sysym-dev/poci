const { User } = require('../user/model/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { config } = require('./auth.config');
const {
  UnauthorizedException,
} = require('../../core/server/exceptions/unauthorized.exception');
const {
  RefreshTokenService,
} = require('../refresh-token/refresh-token.service');
const {
  EmailVerificationService,
} = require('../email-verification/email-verification.service');
const {
  NotFoundException,
} = require('../../core/server/exceptions/not-found.exception');
const { MeService } = require('../me/me.service');
const {
  getUploadPath,
  downloadFile,
} = require('../../core/storage/storage.helper');
const { verifyToken: verifyGoogleToken } = require('../../core/oauth/google');
const {
  getUserFromCode: getGithubUserFromCode,
} = require('../../core/oauth/github');

class AuthService {
  async register(payload) {
    const isUserEmailExists = await this.isUserEmailExists(payload.email);

    if (isUserEmailExists) {
      throw new UnauthorizedException('Email already exists');
    }

    const user = await User.create({
      name: payload.name,
      email: payload.email,
      password: payload.password,
    });

    await EmailVerificationService.createForUser(user, user.email);

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
      const user = await this.findUserById(refreshTokenRow.userId);

      return {
        accessToken: await this.generateAccessToken(user),
      };
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new UnauthorizedException('Token not found');
      }

      throw err;
    }
  }

  async isUserEmailExists(email) {
    return (
      (await User.count({
        where: { email },
      })) > 0
    );
  }

  async findUserByEmail(email) {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email not found');
    }

    return user;
  }

  async findUserById(id) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new UnauthorizedException('User with the id is not found');
    }

    return user;
  }

  async verifyToken(token) {
    try {
      const payload = await jwt.verify(token, config.secret);
      const user = await this.findUserById(payload.userId);

      return user;
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }

  async verifyUserPassword(plain, user) {
    if (!user.password) {
      throw new UnauthorizedException('Password incorrect');
    }

    if (!(await bcrypt.compare(plain, user.password))) {
      throw new UnauthorizedException('Password incorrect');
    }
  }

  async generateAuthResult(user) {
    return {
      me: MeService.generateMe(user),
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

  async loginWithGoogle(token) {
    try {
      const payload = await verifyGoogleToken(token);

      const [user, created] = await User.findOrCreate({
        where: {
          googleId: payload.sub,
        },
        defaults: {
          email: payload.email,
          name: payload.name,
          emailVerifiedAt: new Date(),
        },
      });

      if (created) {
        const fileName = `photo-${Date.now()}.png`;

        await downloadFile(
          payload.picture,
          getUploadPath('users', 'photo', fileName),
        );

        await user.update({
          photoFilename: fileName,
        });
      }

      return await this.generateAuthResult(user);
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }

  async loginWithGithub(code) {
    try {
      const payload = await getGithubUserFromCode(code);

      const [user, created] = await User.findOrCreate({
        where: {
          githubId: payload.id,
        },
        defaults: {
          name: payload.name,
        },
      });

      if (created) {
        const fileName = `photo-${Date.now()}.png`;

        await downloadFile(
          payload.avatar_url,
          getUploadPath('users', 'photo', fileName),
        );

        await user.update({
          photoFilename: fileName,
        });
      }

      return await this.generateAuthResult(user);
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}

exports.AuthService = new AuthService();
