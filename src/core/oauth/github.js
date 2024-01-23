const { default: axios } = require('axios');
const { config } = require('./config');
const {
  UnauthorizedException,
} = require('../server/exceptions/unauthorized.exception');

async function getToken(code) {
  const res = await axios({
    url: 'https://github.com/login/oauth/access_token',
    data: {
      code,
      client_id: config.githubClientId,
      client_secret: config.githubSecret,
    },
    headers: {
      Accept: 'application/json',
    },
  });
  const data = res.data;

  if (data.hasOwnProperty('error')) {
    throw new UnauthorizedException('Invalid code');
  }

  return res.data.access_token;
}
async function getUserFromToken(token) {
  const res = await axios({
    url: 'https://api.github.com/user',
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}
exports.getUserFromCode = async function (code) {
  const accessToken = await getToken(code);
  const user = await getUserFromToken(accessToken);

  return user;
};
