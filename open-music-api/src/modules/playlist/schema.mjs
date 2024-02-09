import {
  array,
  date,
  merge,
  object,
  omit,
  optional,
  picklist,
  string,
} from 'valibot';
import { id } from '../../utils/schema.mjs';
import { SongSchema } from '../song/index.mjs';

export const PlaylistSchema = object({
  id: id('playlist-'),
  name: string(),
  username: string(),
});

export const PlaylistPayloadSchema = object({
  name: string(),
  owner: string(),
});

export const PlaylistExpandedSchema = merge([PlaylistSchema, object({
  songs: array(SongSchema),
})]);

export const PlaylistSongSchema = object({
  id: id('playlist-song-'),
  playlistId: string(),
  songId: string(),
});

export const PlaylistSongPayloadSchema = object({
  songId: string(),
});

export const PlaylistActivityActionSchema = picklist(['add', 'delete']);

export const PlaylistActivitySchema = object({
  id: id('playlist-activity-'),
  playlistId: string(),
  songId: string(),
  userId: string(),
  action: PlaylistActivityActionSchema,
  time: optional(date(), () => new Date()),
});

export const PlaylistActivityPayloadSchema = omit(PlaylistActivitySchema, ['id']);

export const PlaylistActivityItemSchema = object({
  username: string(),
  title: string(),
  time: date(),
  action: PlaylistActivityActionSchema,
});
