import { db } from '../../../db/db';
import { Todo } from './todo.entity';

export class TodoRepository {
  async read(): Promise<Todo[]> {
    return await db<Todo>('todos').select();
  }
}
