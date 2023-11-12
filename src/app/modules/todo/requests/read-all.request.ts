import Joi, { ObjectSchema } from 'joi';
import { ReadAllRequest } from '../../../middlewares/resource-query.middleware';

export class ReadAllTodoRequest extends ReadAllRequest {
  filter(): ObjectSchema<any> {
    return Joi.object({
      is_done: Joi.boolean().optional(),
      due_at_from: Joi.date().optional(),
      due_at_to: Joi.date().optional(),
      search: Joi.string().allow('').optional(),
      done_at_from: Joi.date().optional(),
      done_at_to: Joi.date().optional(),
      is_late: Joi.boolean().optional(),
    }).optional();
  }
}
