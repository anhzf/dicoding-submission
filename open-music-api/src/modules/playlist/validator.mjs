import { createValidation } from '../../utils/validation.mjs';
import { PlaylistPayloadSchema, PlaylistSongPayloadSchema } from './schema.mjs';

const PlaylistValidator = {
  validatePayload: createValidation(PlaylistPayloadSchema),
  validateSongPayload: createValidation(PlaylistSongPayloadSchema),
};

export default PlaylistValidator;
