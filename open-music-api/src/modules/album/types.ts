import type { Output } from 'valibot';
import type { AlbumExpandedSchema, AlbumSchema } from './schema.mjs';
import type { SongService } from './handler.mjs';

export type Album = Output<typeof AlbumSchema>;

export interface AlbumService {
  get(id: string): Promise<Output<typeof AlbumExpandedSchema>>;
  list(): Promise<Album[]>;
  create(payload: Omit<Album, 'id'>): Promise<string>;
  update(payload: Album): Promise<string>;
  delete(id: string): Promise<void>;
}

export interface AlbumPluginOptions {
  service: AlbumService;
  songService?: SongService;
}
