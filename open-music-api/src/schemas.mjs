import {
  number, object, omit, optional, string,
} from 'valibot';
import nanoId from 'nanoid';

export const AlbumSchema = object({
  id: optional(string(), () => `album-${nanoId()}`),
  name: string(),
  year: number(),
});

export const AlbumPayloadSchema = omit(AlbumSchema, ['id']);

export const SongSchema = object({
  id: optional(string(), () => `song-${nanoId()}`),
  title: string(),
  year: number(),
  performer: string(),
  genre: string(),
  duration: optional(number()),
  albumId: optional(string()),
});

export const SongPayloadSchema = omit(SongSchema, ['id']);
