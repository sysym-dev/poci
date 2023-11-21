import Joi, { Schema } from 'joi';
import { RequestValidator } from '../../../middlewares/request-validator.middleware';

export class RegisterRequest extends RequestValidator {
  authorize(): boolean {
    return true;
  }

  schema(): Schema {
    return Joi.object({
      email: Joi.string().email().required(),
      name: Joi.string().required(),
      password: Joi.string().required(),
    });
  }
}
