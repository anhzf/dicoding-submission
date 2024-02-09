import type { Output } from 'valibot';
import type { SongSchema } from '../song/schema.mjs';
import type { PlaylistActivityItemSchema, PlaylistActivityPayloadSchema, PlaylistPayloadSchema, PlaylistSchema } from './schema.mjs';

export type OutPlaylist = Output<typeof PlaylistSchema>;

export interface PlaylistService {
  get(id: string): Promise<OutPlaylist>;
  list(userId: string): Promise<OutPlaylist[]>;
  create(payload: Output<typeof PlaylistPayloadSchema>): Promise<string>;
  delete(id: string): Promise<void>;
  verifyOwner(id: string, userId: string): Promise<void>;
  verifyAccess(id: string, userId: string): Promise<void>;
  listSongs(id: string, userId: string): Promise<Output<typeof SongSchema>[]>;
  addSong(playlistId: string, songId: string): Promise<void>;
  deleteSong(playlistId: string, songId: string): Promise<void>;
  addActivity(payload: Output<typeof PlaylistActivityPayloadSchema>): Promise<string>;
  listActivities(id: string): Promise<Output<typeof PlaylistActivityItemSchema>[]>;
}

export interface PlaylistPluginOptions {
  service: PlaylistService;
}
