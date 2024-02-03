require('../../../src/core/env/load-env');

const request = require('supertest');
const { server } = require('../../../index');
const { connect } = require('../../../src/core/db/connect');
const { migration } = require('../../../scripts/migrate');
const { User } = require('../../../src/features/user/model/user.model');
const { testValidMe } = require('../../supports/me.support');
const { testValidAuthResult } = require('../../supports/auth.support');
const {
  UnauthorizedException,
} = require('../../../src/core/server/exceptions/unauthorized.exception');

beforeAll(async () => {
  await connect();
  await migration.up();
});

beforeEach(async () => {
  await User.destroy({
    where: {},
  });
});

test('the invalid email should be error', async () => {
  const res = await request(server.app)
    .post('/login')
    .send({
      email: 'invalid@email.com',
      password: 'incorrect',
    })
    .expect(401);

  expect(res.body).toEqual(
    new UnauthorizedException('User with the email is not found').toResponse(),
  );
});

test('the incorrect password should be error', async () => {
  const user = await User.create({
    email: 'user@email.com',
    name: 'User',
    password: 'password',
  });

  const res = await request(server.app)
    .post('/login')
    .send({
      email: user.email,
      password: 'incorrect',
    })
    .expect(401);

  expect(res.body).toEqual(
    new UnauthorizedException('Password incorrect').toResponse(),
  );
});

test('the return should be valid auth result', async () => {
  const user = await User.create({
    email: 'user@email.com',
    name: 'User',
    password: 'password',
  });

  const res = await request(server.app)
    .post('/login')
    .send({
      email: user.email,
      password: 'password',
    })
    .expect(200);

  testValidMe(res.body.data.me, user);
  testValidAuthResult(res.body.data.token);
});
