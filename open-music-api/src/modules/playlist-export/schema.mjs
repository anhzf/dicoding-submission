import { email, object, string } from 'valibot';

export const PlaylistExportPayloadSchema = object({
  targetEmail: string([email()]),
});
