const supertest = require('supertest');
const { server } = require('../../../../..');
const {
  BadRequestException,
} = require('../../../../core/server/exceptions/bad-request.exception');
const { User } = require('../../../user/model/user.model');
const { randomToken } = require('../../../../core/utils/string');
const dayjs = require('dayjs');

beforeEach(async () => {
  await User.destroy({
    where: {},
  });
});

test('the invalid token should be error', async () => {
  const res = await supertest(server.app)
    .post('/password/reset')
    .send({
      token: 'invalid',
      password: 'password',
      password_confirmation: 'password',
    })
    .expect(400);

  expect(res.body).toEqual(
    new BadRequestException('Token not found').toResponse(),
  );
});

test('the expired token should be error', async () => {
  const user = await User.create({
    name: 'test',
    email: 'test@email.com',
    password: 'test',
  });
  const forgotPassword = await user.createForgotPassword({
    token: randomToken(),
    expiresIn: dayjs().subtract(1, 'day'),
  });

  const res = await supertest(server.app)
    .post('/password/reset')
    .send({
      token: forgotPassword.token,
      password: 'password',
      password_confirmation: 'password',
    })
    .expect(400);

  expect(res.body).toEqual(
    new BadRequestException('Token not found').toResponse(),
  );
});

test('the valid token should reset user password', async () => {
  const user = await User.create({
    name: 'test',
    email: 'test@email.com',
    password: 'test',
  });
  const forgotPassword = await user.createForgotPassword({
    token: randomToken(),
    expiresIn: dayjs().add(1, 'day'),
  });

  await supertest(server.app)
    .post('/password/reset')
    .send({
      token: forgotPassword.token,
      password: 'password',
      password_confirmation: 'password',
    })
    .expect(200);

  expect(await user.getForgotPassword()).toBeNull();
});
