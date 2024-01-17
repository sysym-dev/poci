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
const { RefreshTokenSchema } = require('./schemas/refresh-token.schema');
const { UpdateEmailSchema } = require('./schemas/update-email.schema');
const {
  createFileUploadHanlder,
} = require('../../core/storage/file-upload.handler');

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
  router.patch('/me/photo', {
    handler: 'updatePhoto',
    middleware: [
      createAuthMiddleware(),
      createFileUploadHanlder('photo', {
        mimetypes: ['image/jpg', 'image/png', 'image/jpeg', 'image/svg'],
        directory: 'users',
        limit: 1048600,
      }),
    ],
  });
  router.patch('/me/email', {
    handler: 'updateEmail',
    middleware: [
      createAuthMiddleware(),
      createBodyValidation(UpdateEmailSchema),
    ],
  });
  router.post('/refresh-token', {
    handler: 'refreshToken',
    middleware: [createBodyValidation(RefreshTokenSchema)],
  });
});
