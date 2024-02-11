import { createValidation } from '../../utils/validation.mjs';
import { AlbumCoverHeadersSchema, AlbumPayloadSchema } from './schema.mjs';

const AlbumValidator = {
  validatePayload: createValidation(AlbumPayloadSchema),
  validateCoverHeaders: createValidation(AlbumCoverHeadersSchema),
};

export default AlbumValidator;
