const {
  createBodyValidation,
} = require('../../server/request/create-body-validation');
const { createRoutes } = require('../../server/router/create-routes');
const { AuthController } = require('./auth.controller');
const { RegisterSchema } = require('./schemas/register.schema');
const { LoginSchema } = require('./schemas/login.schema');

exports.routes = createRoutes(AuthController, (router) => {
  router.post('/register', {
    handler: 'register',
    middleware: [createBodyValidation(RegisterSchema)],
  });
  router.post('/login', {
    handler: 'login',
    middleware: [createBodyValidation(LoginSchema)],
  });
});
