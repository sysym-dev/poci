import { Entity } from '../../../db/entity';

export interface Todo extends Entity {
  name: string;
  due_at: Date;
  done_at?: Date;
}
