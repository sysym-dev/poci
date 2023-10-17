import Joi, { Schema } from 'joi';
import { RequestValidator } from '../../../middlewares/request-validator.middleware';

export class CreateTodoRequest extends RequestValidator {
  authorize(): boolean {
    return true;
  }

  schema(): Schema {
    return Joi.object({
      name: Joi.string().required(),
    });
  }
}
