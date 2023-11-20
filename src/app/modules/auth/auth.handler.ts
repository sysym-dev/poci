import { RouterContext } from '../../router/router';
import { AuthService } from './auth.service';

export class AuthHandler {
  constructor(private authService: AuthService) {}

  async login(context: RouterContext) {
    const res = await this.authService.login({
      email: context.body.email,
      password: context.body.password,
    });

    return await res.getToken();
  }

  async register(context: RouterContext) {
    const res = await this.authService.register({
      name: context.body.name,
      email: context.body.email,
      password: context.body.password,
    });

    return await res.getToken();
  }

  async getMe(context: RouterContext) {
    return context.user;
  }
}
