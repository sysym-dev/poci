const supertest = require('supertest');
const { server } = require('../../../../..');
const { User } = require('../../../user/model/user.model');
const { AuthService } = require('../../../auth/auth.service');
const {
  UnprocessableEntityException,
} = require('../../../../core/server/exceptions/unprocessable-entity.exception');
const {
  TaskCategory,
} = require('../../../task-category/model/task-category.model');

beforeEach(async () => {
  await User.destroy({
    where: {},
  });
});

test('the incomplete form should be error', async () => {
  const user = await User.create({
    name: 'test',
    email: 'test@email.com',
    password: 'password',
  });
  const accessToken = await AuthService.generateAccessToken(user);

  await supertest(server.app)
    .post('/tasks')
    .set('Authorization', accessToken)
    .expect(422);
});

test('the not exist category should be error', async () => {
  const user = await User.create({
    name: 'test',
    email: 'test@email.com',
    password: 'password',
  });
  const accessToken = await AuthService.generateAccessToken(user);

  const res = await supertest(server.app)
    .post('/tasks')
    .set('Authorization', accessToken)
    .send({
      name: 'test',
      task_category_id: 1,
    })
    .expect(422);

  expect(res.body).toEqual(
    new UnprocessableEntityException('Invalid Request (task_category_id)', {
      task_category_id: "task_category_id with value 1 doesn't exists",
    }).toResponse(),
  );
});

test('the not owned category should be error', async () => {
  const user = await User.create({
    name: 'test',
    email: 'test@email.com',
    password: 'password',
  });
  const otherUser = await User.create({
    name: 'test2',
    email: 'test2@email.com',
    password: 'password',
  });
  const accessToken = await AuthService.generateAccessToken(user);
  const taskCategory = await TaskCategory.create({
    name: 'test',
    userId: otherUser.id,
  });

  const res = await supertest(server.app)
    .post('/tasks')
    .set('Authorization', accessToken)
    .send({
      name: 'test',
      task_category_id: taskCategory.id,
    })
    .expect(422);

  expect(res.body).toEqual(
    new UnprocessableEntityException('Invalid Request (task_category_id)', {
      task_category_id: "task_category_id with value 1 doesn't exists",
    }).toResponse(),
  );
});

test.only('the status attribute exists should be error', async () => {
  const user = await User.create({
    name: 'test',
    email: 'test@email.com',
    password: 'password',
  });
  const accessToken = await AuthService.generateAccessToken(user);
  const taskCategory = await TaskCategory.create({
    name: 'test',
    userId: user.id,
  });

  const res = await supertest(server.app)
    .post('/tasks')
    .set('Authorization', accessToken)
    .send({
      name: 'test',
      task_category_id: taskCategory.id,
      status: 'done',
    })
    .expect(422);

  expect(res.body).toEqual(
    new UnprocessableEntityException('Invalid Request', {
      status: '"status" is not allowed',
    }).toResponse(),
  );
});

test('the valid form should be create new task', async () => {
  const user = await User.create({
    name: 'test',
    email: 'test@email.com',
    password: 'password',
  });
  const accessToken = await AuthService.generateAccessToken(user);
  const taskCategory = await TaskCategory.create({
    name: 'test',
    userId: user.id,
  });

  await supertest(server.app)
    .post('/tasks')
    .set('Authorization', accessToken)
    .send({
      name: 'test',
      task_category_id: taskCategory.id,
    })
    .expect(200);
});
