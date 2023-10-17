import Joi, { Schema } from 'joi';
import { RequestValidator } from '../../../middlewares/request-validator.middleware';

export class UpdateTodoRequest extends RequestValidator {
  authorize(): boolean {
    return true;
  }

  schema(): Schema {
    return Joi.object({
      name: Joi.string().optional(),
      done_at: Joi.date().optional(),
    });
  }
}
