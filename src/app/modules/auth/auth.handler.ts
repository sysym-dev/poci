import { RouterContext } from '../../router/router';
import { AuthService } from './auth.service';

export class AuthHandler {
  constructor(private authService: AuthService) {}

  async login(context: RouterContext) {
    return await this.authService.login({
      email: context.body.email,
      password: context.body.password,
    });
  }
}
