const {
  createBodyValidation,
} = require('../../server/request/create-body-validation');
const { createAuthMiddleware } = require('./middlewares/auth.middleware');
const { createRoutes } = require('../../server/router/create-routes');
const { AuthController } = require('./auth.controller');
const { RegisterSchema } = require('./schemas/register.schema');
const { LoginSchema } = require('./schemas/login.schema');
const { UpdateMeSchema } = require('./schemas/update-me.schema');
const { UpdatePasswordSchema } = require('./schemas/update-password.schema');

exports.routes = createRoutes(AuthController, (router) => {
  router.post('/register', {
    handler: 'register',
    middleware: [createBodyValidation(RegisterSchema)],
  });
  router.post('/login', {
    handler: 'login',
    middleware: [createBodyValidation(LoginSchema)],
  });
  router.get('/me', {
    handler: 'me',
    middleware: [createAuthMiddleware()],
  });
  router.patch('/me', {
    handler: 'updateMe',
    middleware: [createAuthMiddleware(), createBodyValidation(UpdateMeSchema)],
  });
  router.patch('/me/password', {
    handler: 'updatePassword',
    middleware: [
      createAuthMiddleware(),
      createBodyValidation(UpdatePasswordSchema),
    ],
  });
});
