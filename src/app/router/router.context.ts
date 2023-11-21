import { User } from '../modules/user/user.entity';

export interface RouterContext {
  params: Record<string, any>;
  query: Record<string, any>;
  body: Record<string, any>;
  user?: User;
}
