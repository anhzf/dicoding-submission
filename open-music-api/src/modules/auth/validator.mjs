import { createValidation } from '../../utils/validation.mjs';
import { DeleteSchema, PostSchema, PutSchema } from './schema.mjs';

const AuthValidator = {
  validatePostPayload: createValidation(PostSchema),
  validatePutPayload: createValidation(PutSchema),
  validateDeletePayload: createValidation(DeleteSchema),
};

export default AuthValidator;
