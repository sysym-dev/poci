const supertest = require('supertest');
const { server } = require('../../../../..');
const {
  BadRequestException,
} = require('../../../../core/server/exceptions/bad-request.exception');
const { User } = require('../../../user/model/user.model');

beforeEach(async () => {
  await User.destroy({
    where: {},
  });
});

test('the not exist email should be error', async () => {
  const res = await supertest(server.app)
    .post('/password/forgot')
    .send({
      email: 'invalid@email.com',
    })
    .expect(400);

  expect(res.body).toEqual(
    new BadRequestException('Email not found').toResponse(),
  );
});

test('the valid email should be send reset password link', async () => {
  const user = await User.create({
    name: 'Test',
    email: 'test@email.com',
    password: 'password',
  });

  await supertest(server.app)
    .post('/password/forgot')
    .send({
      email: user.email,
    })
    .expect(200);

  expect(await user.getForgotPassword()).not.toBeNull();
});
