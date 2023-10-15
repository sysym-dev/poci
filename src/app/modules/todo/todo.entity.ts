import { Entity, EntityAttributes } from '../../../db/entity';

export interface Todo extends Entity {
  name: string;
  done_at: Date;
}

export type TodoAttributes = EntityAttributes<Todo>;
