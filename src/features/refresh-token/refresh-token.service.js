const crypto = require('crypto');
const dayjs = require('dayjs');

exports.RefreshTokenService = new (class {
  async generateRefreshToken(user) {
    const refreshToken = await user.getRefreshToken();

    if (refreshToken) {
      await refreshToken.destroy();
    }

    return await user.createRefreshToken({
      token: crypto.randomBytes(20).toString('hex'),
      expires_in: dayjs().add(1, 'month'),
    });
  }
})();
