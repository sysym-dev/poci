const supertest = require('supertest');
const { server } = require('../../../../../index');
const { User } = require('../../../user/model/user.model');
const { testValidMe } = require('../../../me/tests/supports/me.support');
const { testValidAuthResult } = require('../supports/auth.support');
const {
  UnprocessableEntityException,
} = require('../../../../core/server/exceptions/unprocessable-entity.exception');

beforeEach(async () => {
  await User.destroy({
    where: {},
  });
});

test('the already exists email should be error', async () => {
  const user = await User.create({
    email: 'test@email.com',
    name: 'Test',
    password: 'password',
  });

  const res = await supertest(server.app)
    .post('/register')
    .send({
      email: user.email,
      name: user.name,
      password: user.password,
      password_confirmation: user.password,
    })
    .expect(422);

  expect(res.body).toEqual(
    new UnprocessableEntityException('Invalid Request (email)', {
      email: 'email already exists',
    }).toResponse(),
  );
});

test('the result should be a valid auth result', async () => {
  const res = await supertest(server.app)
    .post('/register')
    .send({
      email: 'test@email.com',
      name: 'Test',
      password: 'password',
      password_confirmation: 'password',
    })
    .expect(200);
  const user = await User.findOne({
    where: {
      email: 'test@email.com',
    },
  });

  testValidMe(res.body.data.me, user);
  testValidAuthResult(res.body.data.token);
});
