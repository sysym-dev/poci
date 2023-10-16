import { Knex } from 'knex';
import { Repository } from '../../../db/repository/repository';
import { Todo } from './todo.entity';
import { hasOwnProperty } from '../../utils/object';

export class TodoRepository extends Repository<Todo> {
  table: string = 'todos';

  filter(values: Record<string, any>): Knex.QueryCallback {
    return (builder: Knex.QueryBuilder) => {
      if (hasOwnProperty(values, 'isDone')) {
        values.isDone
          ? builder.whereNotNull('done_at')
          : builder.whereNull('done_at');
      }

      if (hasOwnProperty(values, 'fromDate')) {
        builder.where('created_at', '>', values.fromDate);
      }

      if (hasOwnProperty(values, 'toDate')) {
        builder.where('created_at', '<', values.toDate);
      }
    };
  }
}
