const {
  createBodyValidation,
} = require('../../core/server/middlewares/body-validation.middleware');
const { createRouter } = require('../../core/server/router');
const { AuthController } = require('./auth.controller');
const { RegisterSchema } = require('./schemas/register.schema');
const { LoginSchema } = require('./schemas/login.schema');
const { RefreshTokenSchema } = require('./schemas/refresh-token.schema');
const { LoginWithGoogleSchema } = require('./schemas/login-with-google.schema');
const { LoginWithGithubSchema } = require('./schemas/login-with-github.schema');

exports.routes = createRouter(AuthController, (router) => {
  router.post('/register', {
    handler: 'register',
    middleware: [createBodyValidation(RegisterSchema)],
  });
  router.post('/login', {
    handler: 'login',
    middleware: [createBodyValidation(LoginSchema)],
  });
  router.post('/refresh-token', {
    handler: 'refreshToken',
    middleware: [createBodyValidation(RefreshTokenSchema)],
  });
  router.post('/login/google', {
    handler: 'loginWithGoogle',
    middleware: [createBodyValidation(LoginWithGoogleSchema)],
  });
  router.post('/login/github', {
    handler: 'loginWithGithub',
    middleware: [createBodyValidation(LoginWithGithubSchema)],
  });
});
