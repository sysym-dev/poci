const supertest = require('supertest');
const { server } = require('../../../../..');
const { User } = require('../../../user/model/user.model');
const { AuthService } = require('../../../auth/auth.service');
const { Task } = require('../../model/task.model');
const {
  TaskCategory,
} = require('../../../task-category/model/task-category.model');

beforeEach(async () => {
  await User.destroy({
    where: {},
  });
  await Task.destroy({
    where: {},
  });
  await TaskCategory.destroy({
    where: {},
  });
});

test('the tasks should be readable', async () => {
  const user = await User.create({
    name: 'test',
    email: 'test@email.com',
    password: 'password',
  });
  const accessToken = await AuthService.generateAccessToken(user);
  const taskCategory = await TaskCategory.create({
    userId: user.id,
    name: 'test',
  });

  await Task.create({
    userId: user.id,
    taskCategoryId: taskCategory.id,
    name: 'test',
  });

  const res = await supertest(server.app)
    .get('/tasks')
    .set('Authorization', accessToken)
    .expect(200);

  expect(res.body.data.meta.count).toBe(1);
  expect(res.body.data.rows).toHaveLength(1);
});

test('the task should be allow to filter by status', async () => {
  const user = await User.create({
    name: 'test',
    email: 'test@email.com',
    password: 'password',
  });
  const accessToken = await AuthService.generateAccessToken(user);
  const taskCategory = await TaskCategory.create({
    userId: user.id,
    name: 'test',
  });

  const tasks = await Task.bulkCreate([
    {
      userId: user.id,
      taskCategoryId: taskCategory.id,
      name: 'todo',
    },
    {
      userId: user.id,
      taskCategoryId: taskCategory.id,
      name: 'done',
      status: 'done',
    },
  ]);

  const res = await supertest(server.app)
    .get('/tasks')
    .set('Authorization', accessToken)
    .query({
      filter: {
        status: 'todo',
      },
    })
    .expect(200);

  expect(res.body.data.meta.count).toBe(1);
  expect(res.body.data.rows).toHaveLength(1);
  expect(res.body.data.rows[0].id).toEqual(tasks[0].id);
});

test('the task should be allow to filter by category', async () => {
  const user = await User.create({
    name: 'test',
    email: 'test@email.com',
    password: 'password',
  });
  const accessToken = await AuthService.generateAccessToken(user);
  const [taskCategoryOne, taskCategoryTwo] = await TaskCategory.bulkCreate([
    {
      userId: user.id,
      name: 'test1',
    },
    {
      userId: user.id,
      name: 'test2',
    },
  ]);

  const tasks = await Task.bulkCreate([
    {
      userId: user.id,
      taskCategoryId: taskCategoryOne.id,
      name: 'test1',
    },
    {
      userId: user.id,
      taskCategoryId: taskCategoryTwo.id,
      name: 'test2',
    },
  ]);

  const res = await supertest(server.app)
    .get('/tasks')
    .set('Authorization', accessToken)
    .query({
      filter: {
        task_category_id: taskCategoryOne.id,
      },
    })
    .expect(200);

  expect(res.body.data.meta.count).toBe(1);
  expect(res.body.data.rows).toHaveLength(1);
  expect(res.body.data.rows[0].id).toEqual(tasks[0].id);
});

test('the task should be doesnot allow to filter by category that not owning', async () => {
  const [user, otherUser] = await User.bulkCreate([
    {
      name: 'test',
      email: 'test@email.com',
      password: 'password',
    },
    {
      name: 'other-user',
      email: 'other-user@email.com',
      password: 'password',
    },
  ]);
  const accessToken = await AuthService.generateAccessToken(user);
  const taskCategoryOtherUser = await TaskCategory.create({
    userId: otherUser.id,
    name: 'test2',
  });

  const res = await supertest(server.app)
    .get('/tasks')
    .set('Authorization', accessToken)
    .query({
      filter: {
        task_category_id: taskCategoryOtherUser.id,
      },
    })
    .expect(422);
});
