import { db } from '../../../db/db';
import { EntityId } from '../../../db/entity';
import { Todo, TodoAttributes } from './todo.entity';

export class TodoRepository {
  async read(): Promise<Todo[]> {
    return await db<Todo>('todos').select();
  }

  async store(id: EntityId | null, todo: Partial<TodoAttributes>) {
    if (id) {
      await db('todos').where('id', id).update(todo);
    } else {
      await db('todos').insert(todo);
    }
  }
}
