import { createValidation } from '../../utils/validation.mjs';
import { PlaylistExportPayloadSchema } from './schema.mjs';

const PlaylistExportValidator = {
  validatePayload: createValidation(PlaylistExportPayloadSchema),
};

export default PlaylistExportValidator;
