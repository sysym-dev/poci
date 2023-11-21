import { Knex } from 'knex';
import { Repository } from '../../../db/repository/repository';
import { User } from './user.entity';
import { hasOwnProperty } from '../../utils/object';

export class UserRepository extends Repository<User> {
  table: string = 'users';

  filter(values: Record<string, any>): Knex.QueryCallback {
    return (builder: Knex.QueryBuilder) => {
      if (hasOwnProperty(values, 'email')) {
        builder.where('email', values.email);
      }

      if (hasOwnProperty(values, 'id')) {
        builder.where('id', values.id);
      }
    };
  }
}
