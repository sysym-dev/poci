require('../../../src/core/env/load-env');

const request = require('supertest');
const { server } = require('../../../index');
const { connect } = require('../../../src/core/db/connect');
const { migration } = require('../../../scripts/migrate');

beforeAll(async () => {
  await connect();
  await migration.up();
});

test('the endpoint is accessable', async () => {
  await request(server.app).post('/login').expect(422);
});

test('the invalid email should be error', async () => {
  const res = await request(server.app)
    .post('/login')
    .send({
      email: 'invalid@email.com',
      password: 'incorrect',
    })
    .expect(401);
});
