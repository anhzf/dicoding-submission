import { createValidation } from '../../utils/validation.mjs';
import { SongPayloadSchema } from './schema.mjs';

const SongValidator = {
  validatePayload: createValidation(SongPayloadSchema),
};

export default SongValidator;
