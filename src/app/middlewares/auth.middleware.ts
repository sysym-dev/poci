import { Handler } from 'express';
import { Request } from '../router/request/request';
import { AuthService } from '../modules/auth/auth.service';
import { HttpError } from '../../server/errors/http.error';

export function createAuthMiddleware(authService: AuthService): Handler {
  return async (req: Request, res, next) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new HttpError({
          name: 'Unauthorized',
          message: 'Access token required',
        });
      }

      req['user'] = await authService.authenticate(accessToken);

      next();
    } catch (err) {
      next(err);
    }
  };
}
