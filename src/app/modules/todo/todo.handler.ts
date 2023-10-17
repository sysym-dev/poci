import { RouterContext } from '../../router/router';
import { TodoRepository } from './todo.repository';

export class TodoHandler {
  constructor(private todoRepository: TodoRepository) {}

  async getAll(context?: RouterContext) {
    return await this.todoRepository.read(context?.query);
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
    return await this.todoRepository.store({
      values: {
        name: context?.body.name,
      },
    });
  }

  async update(context: RouterContext) {
    return await this.todoRepository.store({
      filter: {
        id: context?.params.id,
      },
      values: context.body,
      failOrNull: true,
    });
  }

  async delete(context: RouterContext) {
    return await this.todoRepository.delete({
      filter: {
        id: context?.params.id,
      },
      failOrNull: true,
    });
  }
}
