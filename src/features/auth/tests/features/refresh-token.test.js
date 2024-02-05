const supertest = require('supertest');
const { server } = require('../../../../..');
const {
  UnauthorizedException,
} = require('../../../../core/server/exceptions/unauthorized.exception');
const {
  RefreshToken,
} = require('../../../refresh-token/model/refresh-token.model');
const { User } = require('../../../user/model/user.model');
const { randomToken } = require('../../../../core/utils/string');
const dayjs = require('dayjs');

beforeEach(async () => {
  await RefreshToken.destroy({
    where: {},
  });
  await User.destroy({
    where: {},
  });
});

test('the invalid refresh token should error', async () => {
  const res = await supertest(server.app)
    .post('/refresh-token')
    .send({
      token: 'invalid',
    })
    .expect(401);

  expect(res.body).toEqual(
    new UnauthorizedException('Token not found').toResponse(),
  );
});

test('the expired refresh token should error', async () => {
  const user = await User.create({
    name: 'Test',
    email: 'test@email.com',
    password: 'password',
  });
  const refreshToken = await user.createRefreshToken({
    token: randomToken(),
    expiresIn: dayjs().subtract(1, 'month'),
  });

  const res = await supertest(server.app)
    .post('/refresh-token')
    .send({
      token: refreshToken.token,
    })
    .expect(401);

  expect(res.body).toEqual(
    new UnauthorizedException('Token not found').toResponse(),
  );
});

test('the valid refresh token should return access token', async () => {
  const user = await User.create({
    name: 'Test',
    email: 'test@email.com',
    password: 'password',
  });
  const refreshToken = await user.createRefreshToken({
    token: randomToken(),
    expiresIn: dayjs().add(1, 'month'),
  });

  const res = await supertest(server.app)
    .post('/refresh-token')
    .send({
      token: refreshToken.token,
    })
    .expect(200);

  expect(res.body).toHaveProperty('data');
  expect(res.body.data).toHaveProperty('accessToken');
  expect(typeof res.body.data.accessToken).toBe('string');
});
