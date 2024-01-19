if (process.env.NODE_ENV === 'development') {
  require('dotenv/config');
}

const { createServer } = require('./src/core/server/server.js');
const { connect } = require('./src/core/db/connect.js');
const { TaskResource } = require('./src/features/task/task.resource.js');
const {
  TaskCategoryResource,
} = require('./src/features/task-category/task-category.resource.js');
const { routes: authRoutes } = require('./src/features/auth/auth.routes.js');
const {
  routes: emailVerificationRoutes,
} = require('./src/features/email-verification/email-verification.routes.js');
const { routes: meRoutes } = require('./src/features/me/me.routes.js');

async function start() {
  try {
    await connect();

    const server = createServer({
      resources: [TaskResource, TaskCategoryResource],
      routes: [authRoutes, meRoutes, emailVerificationRoutes],
    });

    server.listen();
  } catch (err) {
    console.error(err);

    process.exit(1);
  }
}

start();
