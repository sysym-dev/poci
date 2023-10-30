import { Knex } from 'knex';
import { Repository } from '../../../db/repository/repository';
import { Todo } from './todo.entity';
import { hasOwnProperty } from '../../utils/object';

export class TodoRepository extends Repository<Todo> {
  table: string = 'todos';

  filter(values: Record<string, any>): Knex.QueryCallback {
    return (builder: Knex.QueryBuilder) => {
      if (hasOwnProperty(values, 'id')) {
        builder.where('id', values.id);
      }

      if (hasOwnProperty(values, 'is_done')) {
        values.is_done
          ? builder.whereNotNull('done_at')
          : builder.whereNull('done_at');
      }

      if (hasOwnProperty(values, 'due_at_from')) {
        builder.where('due_at', '>', values.due_at_from);
      }

      if (hasOwnProperty(values, 'due_at_to')) {
        builder.where('due_at', '<', values.due_at_to);
      }
    };
  }
}
