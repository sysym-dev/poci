import { createRequestValidatorMiddleware } from '../../middlewares/request-validator.middleware';
import { createRouter } from '../../router/router';
import { UserRepository } from '../user/user.repository';
import { AuthHandler } from './auth.handler';
import { AuthService } from './auth.service';
import { LoginRequest } from './requests/login.request';
import { RegisterRequest } from './requests/register.request';

const router = createRouter('/auth');
const handler = new AuthHandler(new AuthService(new UserRepository()));

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

export const authRoutes = router.make();
