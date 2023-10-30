import Joi, { ObjectSchema } from 'joi';
import { ReadAllRequest } from '../../../middlewares/resource-query.middleware';

export class ReadAllTodoRequest extends ReadAllRequest {
  filter(): ObjectSchema<any> {
    return Joi.object({
      is_done: Joi.boolean().optional(),
    }).optional();
  }
}
