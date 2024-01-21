const {
  createBodyValidation,
} = require('../../core/server/middlewares/body-validation.middleware');
const { createRouter } = require('../../core/server/router');
const { ForgotPasswordController } = require('./forgot-password.controller');
const { ForgotPasswordSchema } = require('./schemas/forgot-password.schema');

exports.routes = createRouter(ForgotPasswordController, (router) => {
  router.post('/password/forgot', {
    handler: 'forgotPassword',
    middleware: [createBodyValidation(ForgotPasswordSchema)],
  });
});
