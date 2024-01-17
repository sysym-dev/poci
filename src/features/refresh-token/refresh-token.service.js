const { randomToken } = require('../../utils/string');
const dayjs = require('dayjs');
const { RefreshToken } = require('./model/refresh-token.model');
const { Op } = require('sequelize');
const { RefreshTokenException } = require('./refresh-token.exception');

exports.RefreshTokenService = new (class {
  async generateRefreshToken(user) {
    const refreshToken = await user.getRefreshToken();

    if (refreshToken) {
      await refreshToken.destroy();
    }

    return await user.createRefreshToken({
      token: randomToken(),
      expiresIn: dayjs().add(1, 'month'),
    });
  }
  async findByToken(token) {
    const refreshToken = await RefreshToken.findOne({
      where: {
        token,
        expiresIn: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!refreshToken) {
      throw new RefreshTokenException();
    }

    return refreshToken;
  }
})();
