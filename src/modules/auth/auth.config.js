exports.config = {
  secret: process.env.AUTH_SECRET,
  expiresIn: process.env.AUTH_ACCESS_TOKEN_EXPIRY,
};
