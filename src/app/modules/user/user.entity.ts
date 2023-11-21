import { Entity } from '../../../db/entity';

export interface User extends Entity {
  email: string;
  name: string;
  password: string;
}
