import { createAuthMiddleware } from '../../middlewares/auth.middleware';
import { createRequestValidatorMiddleware } from '../../middlewares/request-validator.middleware';
import { createRouter } from '../../router/router';
import { UserRepository } from '../user/user.repository';
import { AuthHandler } from './auth.handler';
import { AuthService } from './auth.service';
import { LoginRequest } from './requests/login.request';
import { RegisterRequest } from './requests/register.request';

const router = createRouter('/auth');

const authService = new AuthService(new UserRepository());
const handler = new AuthHandler(authService);

router.handle({
  path: '/login',
  method: 'post',
  middlewares: [createRequestValidatorMiddleware(LoginRequest)],
  async handler(context) {
    return await handler.login(context);
  },
});

router.handle({
  path: '/register',
  method: 'post',
  middlewares: [createRequestValidatorMiddleware(RegisterRequest)],
  async handler(context) {
    return await handler.register(context);
  },
});

router.handle({
  path: '/me',
  method: 'get',
  middlewares: [createAuthMiddleware(authService)],
  handler(context) {
    return handler.getMe(context);
  },
});

export const authRoutes = router.make();
