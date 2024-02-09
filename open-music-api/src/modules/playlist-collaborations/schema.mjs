import { object, omit, string } from 'valibot';
import { id } from '../../utils/schema.mjs';

export const PlaylistCollaborationSchema = object({
  id: id('collab-'),
  playlistId: string(),
  userId: string(),
});

export const PlaylistCollaborationPayloadSchema = omit(PlaylistCollaborationSchema, ['id']);
