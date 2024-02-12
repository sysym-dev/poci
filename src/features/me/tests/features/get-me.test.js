const supertest = require('supertest');
const jwt = require('jsonwebtoken');
const { server } = require('../../../../..');
const {
  UnauthorizedException,
} = require('../../../../core/server/exceptions/unauthorized.exception');
const { AuthService } = require('../../../auth/auth.service');
const { User } = require('../../../user/model/user.model');
const { testValidMe } = require('../supports/me.support');

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

test('test invalid user should be error', async () => {
  const user = await User.create({
    name: 'test',
    email: 'test@email.com',
    password: 'password',
  });
  const accessToken = await AuthService.generateAccessToken(user);

  await user.destroy();

  const res = await supertest(server.app)
    .get('/me')
    .set('Authorization', accessToken)
    .expect(401);

  expect(res.body).toEqual(
    new UnauthorizedException('User with the id is not found').toResponse(),
  );
});

test('test valid access token should return me', async () => {
  const user = await User.create({
    name: 'test',
    email: 'test@email.com',
    password: 'password',
  });
  const accessToken = await AuthService.generateAccessToken(user);

  const res = await supertest(server.app)
    .get('/me')
    .set('Authorization', accessToken)
    .expect(200);

  testValidMe(res.body.data, user);
});
