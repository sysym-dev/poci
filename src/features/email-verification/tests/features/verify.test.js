const supertest = require('supertest');
const { server } = require('../../../../..');
const {
  BadRequestException,
} = require('../../../../core/server/exceptions/bad-request.exception');
const { User } = require('../../../user/model/user.model');
const { randomToken } = require('../../../../core/utils/string');
const dayjs = require('dayjs');
const { EmailVerification } = require('../../model/email-verification.model');
const { config } = require('../../../../core/app/app.config');

beforeEach(async () => {
  await User.destroy({
    where: {},
  });
  await EmailVerification.destroy({
    where: {},
  });
});

test('the invalid token should error', async () => {
  const res = await supertest(server.app)
    .get('/email/verify')
    .query({
      token: 'invalid',
    })
    .expect(400);

  expect(res.body).toEqual(
    new BadRequestException('Token not found').toResponse(),
  );
});

test('the expired token should error', async () => {
  const user = await User.create({
    name: 'Test',
    email: 'test@email.com',
    password: 'password',
  });

  const emailVerification = await user.createEmailVerification({
    email: user.email,
    token: randomToken(),
    expiresIn: dayjs().subtract(1, 'day'),
  });

  const res = await supertest(server.app)
    .get('/email/verify')
    .query({
      token: emailVerification.token,
    })
    .expect(400);

  expect(res.body).toEqual(
    new BadRequestException('Token not found').toResponse(),
  );
});

test('the valid token should verify user email', async () => {
  const user = await User.create({
    name: 'Test',
    email: 'test@email.com',
    password: 'password',
  });

  const emailVerification = await user.createEmailVerification({
    email: user.email,
    token: randomToken(),
    expiresIn: dayjs().add(1, 'day'),
  });

  await supertest(server.app)
    .get('/email/verify')
    .query({
      token: emailVerification.token,
    })
    .expect(302)
    .expect('Location', config.clientUrl);

  await user.reload();

  expect(user.isEmailVerified).toBe(true);
  expect(await user.getEmailVerification()).toBeNull();
});
