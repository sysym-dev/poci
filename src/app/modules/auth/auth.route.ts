import { createRequestValidatorMiddleware } from '../../middlewares/request-validator.middleware';
import { createRouter } from '../../router/router';
import { AuthHandler } from './auth.handler';
import { LoginRequest } from './requests/login.request';

const router = createRouter('/auth');
const handler = new AuthHandler();

router.handle({
  path: '/login',
  method: 'post',
  middlewares: [createRequestValidatorMiddleware(LoginRequest)],
  async handler(context) {
    return await handler.login(context);
  },
});

export const authRoutes = router.make();
