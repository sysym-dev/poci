const { OAuth2Client } = require('google-auth-library');

exports.verifyToken = async (token) => {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken: token,
  });

  return ticket.getPayload();
};
