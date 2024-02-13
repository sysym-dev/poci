const supertest = require('supertest');
const { server } = require('../../../../..');
const {
  BadRequestException,
} = require('../../../../core/server/exceptions/bad-request.exception');
const { User } = require('../../../user/model/user.model');
const { randomToken } = require('../../../../core/utils/string');
const dayjs = require('dayjs');

beforeEach(async () => {
  await User.destroy({ where: {} });
});

test('the not existing email should be error', async () => {
  const res = await supertest(server.app)
    .post('/email/resend')
    .send({
      email: 'invalid@email.com',
    })
    .expect(400);

  expect(res.body).toEqual(
    new BadRequestException('Email not found').toResponse(),
  );
});

test('the valid email should be send new link', async () => {
  const user = await User.create({
    email: 'test@email.com',
    name: 'Test',
    password: 'password',
  });
  await user.createEmailVerification({
    email: user.email,
    token: randomToken(),
    expiresIn: dayjs().add(1, 'day'),
  });

  await supertest(server.app)
    .post('/email/resend')
    .send({
      email: user.email,
    })
    .expect(200);
});
