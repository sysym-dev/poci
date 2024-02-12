const supertest = require('supertest');
const jwt = require('jsonwebtoken');
const { server } = require('../../../../..');
const {
  UnauthorizedException,
} = require('../../../../core/server/exceptions/unauthorized.exception');
const { AuthService } = require('../../../auth/auth.service');
const { User } = require('../../../user/model/user.model');

beforeEach(async () => {
  await User.destroy({
    where: {},
  });
});

test('the invalid token should be error', async () => {
  const res = await supertest(server.app)
    .get('/me')
    .set('Authorization', 'invalid')
    .expect(401);

  expect(res.body).toEqual(
    new UnauthorizedException('Access token invalid').toResponse(),
  );
});

test('the expired token should be error', async () => {
  const user = await User.create({
    name: 'test',
    email: 'test@email.com',
    password: 'password',
  });
  const accessToken = await AuthService.generateAccessToken(user, {
    expiresIn: '1s',
  });

  await new Promise((r) => setTimeout(r, 2000));

  const res = await supertest(server.app)
    .get('/me')
    .set('Authorization', accessToken)
    .expect(401);

  expect(res.body).toEqual(
    new UnauthorizedException('Access token expired').toResponse(),
  );
});

// test.only('test invalid user should be error')
