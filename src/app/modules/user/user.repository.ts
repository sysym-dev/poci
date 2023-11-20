import { Knex } from 'knex';
import { Repository } from '../../../db/repository/repository';
import { User } from './user.entity';

export class UserRepository extends Repository<User> {
  table: string = 'users';

  filter(values: Record<string, any>): Knex.QueryCallback {
    return (builder: Knex.QueryBuilder) => {};
  }
}
