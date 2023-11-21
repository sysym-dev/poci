import { TodoRepository } from '../todo/todo.repository';

export class DashboardHandler {
  constructor(private todoRepository: TodoRepository) {}

  async get() {
    const [taskCount, todoCount, doneCount, lateCount] = await Promise.all([
      await this.todoRepository.count({}),
      await this.todoRepository.count({ filter: { is_done: false } }),
      await this.todoRepository.count({ filter: { is_done: true } }),
      await this.todoRepository.count({ filter: { is_late: true } }),
    ]);

    return { taskCount, todoCount, doneCount, lateCount };
  }
}
