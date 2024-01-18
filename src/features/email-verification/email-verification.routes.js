const {
  createRequestValidation,
} = require('../../core/server/handlers/request-validation.handler');
const { createRoutes } = require('../../server/router/create-routes');
const {
  EmailVerificationController,
} = require('./email-verification.controller');
const { VerifySchema } = require('./schemas/verify.schema');

exports.routes = createRoutes(EmailVerificationController, (router) => {
  router.get('/email/verify', {
    handler: 'verify',
    middleware: [
      createRequestValidation(VerifySchema, {
        path: 'query',
        wrapObject: true,
      }),
    ],
  });
});
