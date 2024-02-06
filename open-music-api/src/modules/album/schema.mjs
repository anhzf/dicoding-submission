import { nanoid } from 'nanoid';
import {
  number, object,
  optional, string,
} from 'valibot';

export const AlbumSchema = object({
  id: optional(string(), () => `album-${nanoid()}`),
  name: string(),
  year: number(),
});
