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

      if (hasOwnProperty(values, 'from_date')) {
        builder.where('created_at', '>', values.from_date);
      }

      if (hasOwnProperty(values, 'to_date')) {
        builder.where('created_at', '<', values.to_date);
      }
    };
  }
}
