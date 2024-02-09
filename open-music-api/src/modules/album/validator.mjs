import { createValidation } from '../../utils/validation.mjs';
import { AlbumPayloadSchema } from './schema.mjs';

const AlbumValidator = {
  validatePayload: createValidation(AlbumPayloadSchema),
};

export default AlbumValidator;
