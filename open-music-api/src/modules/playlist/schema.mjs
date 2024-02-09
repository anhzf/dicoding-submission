import {
  array,
  merge,
  object,
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
