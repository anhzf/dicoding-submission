import { nanoid } from 'nanoid';
import {
  number, object,
  omit,
  optional, pick, string,
} from 'valibot';
import { orNull } from '../../utils/schema.mjs';

export const SongDetailSchema = object({
  id: optional(string(), () => `song-${nanoid()}`),
  title: string(),
  year: number(),
  performer: string(),
  genre: string(),
  duration: orNull(number()),
  albumId: orNull(string()),
});

export const SongPayloadSchema = omit(SongDetailSchema, ['id']);

export const SongSchema = pick(SongDetailSchema, ['id', 'title', 'performer']);
