if (process.env.NODE_ENV === 'development') {
  require('dotenv/config');
}

const { createServer } = require('./src/server/create-server.js');
const { connect } = require('./src/db/connect.js');
const { TaskResource } = require('./src/modules/task/task.resource.js');
const {
  TaskCategoryResource,
} = require('./src/modules/task-category/task-category.resource.js');
const { routes: authRoutes } = require('./src/modules/auth/auth.routes.js');
const {
  routes: emailVerificationRoutes,
} = require('./src/features/email-verification/email-verification.routes.js');

async function start() {
  try {
    await connect();

    const server = createServer({
      port: 3000,
      resources: [TaskResource, TaskCategoryResource],
      routes: [authRoutes, emailVerificationRoutes],
    });

    server.listen();
  } catch (err) {
    console.error(err);

    process.exit(1);
  }
}

start();
