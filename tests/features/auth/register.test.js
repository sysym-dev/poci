const supertest = require('supertest');
const { server } = require('../../..');
const { User } = require('../../../src/features/user/model/user.model');
const {
  UnprocessableEntityException,
} = require('../../../src/core/server/exceptions/unprocessable-entity.exception');

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
