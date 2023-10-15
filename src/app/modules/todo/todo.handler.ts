import { RouterContext } from '../../router/router';
import { TodoRepository } from './todo.repository';

export class TodoHandler {
  constructor(private todoRepository: TodoRepository) {}

  async getAll(context?: RouterContext) {
    return await this.todoRepository.read();
  }

  async create(context?: RouterContext) {
    return await this.todoRepository.store(null, {
      name: context?.body.name,
    });
  }
}
