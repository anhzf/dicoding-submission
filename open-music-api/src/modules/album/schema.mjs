import { nanoid } from 'nanoid';
import {
  array,
  merge,
  number, object,
  omit,
  optional, string,
} from 'valibot';
import { SongSchema } from '../song/schema.mjs';

export const AlbumSchema = object({
  id: optional(string(), () => `album-${nanoid()}`),
  name: string(),
  year: number(),
});

export const AlbumPayloadSchema = omit(AlbumSchema, ['id']);

export const AlbumExpandedSchema = merge([AlbumSchema, object({
  songs: optional(array(SongSchema), []),
})]);
