import { createValidation } from '../../utils/validation.mjs';
import { PlaylistCollaborationPayloadSchema } from './schema.mjs';

const PlaylistCollaborationValidator = {
  validatePayload: createValidation(PlaylistCollaborationPayloadSchema),
};

export default PlaylistCollaborationValidator;
