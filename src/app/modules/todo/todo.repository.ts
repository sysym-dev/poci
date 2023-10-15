import { Repository } from '../../../db/repository/repository';
import { Todo } from './todo.entity';

export class TodoRepository extends Repository<Todo> {
  table: string = 'todos';
}
