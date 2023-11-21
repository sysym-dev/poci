import { RouteContext } from '../../router/route.context';
import { AuthService } from './auth.service';

export class AuthHandler {
  constructor(private authService: AuthService) {}

  async login(context: RouteContext) {
    const res = await this.authService.login({
      email: context.body.email,
      password: context.body.password,
    });

    return await res.getToken();
  }

  async register(context: RouteContext) {
    const res = await this.authService.register({
      name: context.body.name,
      email: context.body.email,
      password: context.body.password,
    });

    return await res.getToken();
  }

  async getMe(context: RouteContext) {
    return context.user;
  }
}
