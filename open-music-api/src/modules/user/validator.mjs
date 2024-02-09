import { createValidation } from '../../utils/validation.mjs';
import { UserPayloadSchema } from './schema.mjs';

const UserValidator = {
  validatePayload: createValidation(UserPayloadSchema),
};

export default UserValidator;
