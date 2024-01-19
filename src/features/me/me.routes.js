const {
  createBodyValidation,
} = require('../../core/server/middlewares/body-validation.middleware');
const {
  createRequireAuth,
} = require('../auth/middlewares/require-auth.middleware');
const { createRouter } = require('../../core/server/router');
const { MeController } = require('./me.controller');
const { UpdateMeSchema } = require('./schemas/update-me.schema');
const { UpdatePasswordSchema } = require('./schemas/update-password.schema');
const { UpdateEmailSchema } = require('./schemas/update-email.schema');
const {
  createFileUploadHanlder,
} = require('../../core/storage/file-upload.handler');

exports.routes = createRouter(MeController, (router) => {
  router.get('/me', {
    handler: 'me',
    middleware: [createRequireAuth()],
  });
  router.patch('/me', {
    handler: 'updateMe',
    middleware: [createRequireAuth(), createBodyValidation(UpdateMeSchema)],
  });
  router.patch('/me/password', {
    handler: 'updatePassword',
    middleware: [
      createRequireAuth(),
      createBodyValidation(UpdatePasswordSchema),
    ],
  });
  router.patch('/me/photo', {
    handler: 'updatePhoto',
    middleware: [
      createRequireAuth(),
      createFileUploadHanlder('photo', {
        mimetypes: ['image/jpg', 'image/png', 'image/jpeg', 'image/svg'],
        directory: 'users',
        limit: 1048600,
      }),
    ],
  });
  router.patch('/me/email', {
    handler: 'updateEmail',
    middleware: [createRequireAuth(), createBodyValidation(UpdateEmailSchema)],
  });
});
