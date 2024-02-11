import { nanoid } from 'nanoid';
import {
  array,
  merge,
  number, object,
  omit,
  optional, picklist, string, unknown,
} from 'valibot';
import { orNull } from '../../utils/schema.mjs';
import { SongSchema } from '../song/schema.mjs';

export const AlbumSchema = object({
  id: optional(string(), () => `album-${nanoid()}`),
  name: string(),
  year: number(),
  cover: orNull(string()),
});

export const AlbumPayloadSchema = omit(AlbumSchema, ['id']);

export const AlbumExpandedSchema = merge([AlbumSchema, object({
  songs: optional(array(SongSchema), []),
})]);

export const AlbumCoverHeadersSchema = object({
  'content-type': picklist(['image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp']),
}, unknown());
