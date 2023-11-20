import { RouterContext } from '../../router/router';

export class AuthHandler {
  async login(context: RouterContext) {
    return context.body;
  }
}
