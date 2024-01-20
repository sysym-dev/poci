const {
  createRequestValidation,
} = require('../../core/server/middlewares/request-validation.middleware');
const { createRouter } = require('../../core/server/router');
const {
  EmailVerificationController,
} = require('./email-verification.controller');
const { VerifySchema } = require('./schemas/verify.schema');
const { ResendSchema } = require('./schemas/resend.schema');
const {
  createBodyValidation,
} = require('../../core/server/middlewares/body-validation.middleware');
const { config } = require('../../core/app/app.config');

exports.routes = createRouter(EmailVerificationController, (router) => {
  router.get('/email/verify', {
    handler: 'verify',
    redirect: config.clientUrl,
    middleware: [
      createRequestValidation(VerifySchema, {
        path: 'query',
        wrapObject: true,
      }),
    ],
  });
  router.post('/email/resend', {
    handler: 'resend',
    middleware: [createBodyValidation(ResendSchema)],
  });
});
