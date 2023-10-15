import { Entity } from '../../../db/entity';

export interface Todo extends Entity {
  name: string;
  done_at: Date;
}
