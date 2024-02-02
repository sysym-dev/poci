const { createServer } = require('./src/core/server/server.js');
const { TaskResource } = require('./src/features/task/task.resource.js');
const {
  TaskCategoryResource,
} = require('./src/features/task-category/task-category.resource.js');
const { routes: authRoutes } = require('./src/features/auth/auth.routes.js');
const {
  routes: emailVerificationRoutes,
} = require('./src/features/email-verification/email-verification.routes.js');
const {
  routes: forgotPasswordRoutes,
} = require('./src/features/forgot-password/forgot-password.routes.js');
const { routes: meRoutes } = require('./src/features/me/me.routes.js');

exports.server = createServer({
  resources: [TaskResource, TaskCategoryResource],
  routes: [authRoutes, meRoutes, emailVerificationRoutes, forgotPasswordRoutes],
});
