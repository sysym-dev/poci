import { RouterContext } from '../../router/router';
import { TodoRepository } from './todo.repository';

export class TodoHandler {
  constructor(private todoRepository: TodoRepository) {}

  async getAll(context?: RouterContext) {
    return await this.todoRepository.read({
      // page: {
      //   size: 2,
      //   number: 2,
      // },
      // filter: {
      //   isDone: false,
      //   toDate: new Date(),
      // },
      sort: {},
    });
  }

  async getOne(context?: RouterContext) {
    return await this.todoRepository.read({
      filter: {
        id: context?.params.id,
      },
      first: true,
      failOnNull: true,
    });
  }

  async create(context?: RouterContext) {
    return await this.todoRepository.store(null, {
      name: context?.body.name,
    });
  }
}
