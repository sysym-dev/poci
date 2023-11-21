import Joi, { ObjectSchema } from 'joi';
import { ReadAllRequest } from '../../../middlewares/resource-query.middleware';
import { RouterContext } from '../../../router/router';
import { hasOwnProperty } from '../../../utils/object';

export class ReadAllTodoRequest extends ReadAllRequest {
  authorize(context: RouterContext): boolean {
    if (!hasOwnProperty(context.query?.filter ?? {}, 'user_id')) {
      return false;
    }

    return true;
  }

  filter(): ObjectSchema<any> {
    return Joi.object({
      is_done: Joi.boolean().optional(),
      due_at_from: Joi.date().optional(),
      due_at_to: Joi.date().optional(),
      search: Joi.string().allow('').optional(),
      done_at_from: Joi.date().optional(),
      done_at_to: Joi.date().optional(),
      is_late: Joi.boolean().optional(),
      user_id: Joi.number().optional(),
    }).optional();
  }
}
