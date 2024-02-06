import { nanoid } from 'nanoid';
import {
  number, object,
  optional, pick, string,
} from 'valibot';

export const SongDetailSchema = object({
  id: optional(string(), () => `song-${nanoid()}`),
  title: string(),
  year: number(),
  performer: string(),
  genre: string(),
  duration: optional(number()),
  albumId: optional(string()),
});

export const SongSchema = pick(SongDetailSchema, ['id', 'title', 'performer']);
