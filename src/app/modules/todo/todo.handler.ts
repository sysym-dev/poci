import { RouteContext } from '../../router/route.context';
import { TodoRepository } from './todo.repository';

export class TodoHandler {
  constructor(private todoRepository: TodoRepository) {}

  async getAll(context?: RouteContext) {
    return await this.todoRepository.read(context?.query);
  }

  async getOne(context?: RouteContext) {
    return await this.todoRepository.read({
      filter: {
        id: context?.params.id,
      },
      first: true,
      failOnNull: true,
    });
  }

  async create(context?: RouteContext) {
    return await this.todoRepository.store({
      values: {
        name: context?.body.name,
        due_at: context?.body.due_at,
      },
    });
  }

  async update(context: RouteContext) {
    return await this.todoRepository.store({
      filter: {
        id: context?.params.id,
      },
      values: context.body,
      failOrNull: true,
    });
  }

  async delete(context: RouteContext) {
    return await this.todoRepository.delete({
      filter: {
        id: context?.params.id,
      },
      failOrNull: true,
    });
  }
}
