import type { Output } from 'valibot';
import type { PlaylistCollaborationPayloadSchema } from './schema.mjs';
import type { PlaylistService } from '../playlist/types';

type Payload = Output<typeof PlaylistCollaborationPayloadSchema>;

export interface PlaylistCollaborationService {
  addCollaborator(payload: Payload): Promise<string>;
  deleteCollaborator(payload: Payload): Promise<void>;
  verifyAccess(payload: Payload): Promise<void>;
}

export interface PlaylistCollaborationPluginOptions {
  service: PlaylistCollaborationService;
  playlistService: PlaylistService;
}
