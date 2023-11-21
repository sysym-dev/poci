import { Request as ExpressRequest } from 'express';
import { User } from '../../modules/user/user.entity';

export interface Request extends ExpressRequest {
  user?: User;
}
