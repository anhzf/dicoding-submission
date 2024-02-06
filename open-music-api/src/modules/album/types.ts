import type { Output } from 'valibot';
import type { AlbumSchema } from './schema.mjs';

export type Album = Output<typeof AlbumSchema>;

export interface AlbumService {
  get(id: string): Promise<Album>;
  list(): Promise<Album[]>;
  create(payload: Omit<Album, 'id'>): Promise<string>;
  update(payload: Omit<Album, 'id'>): Promise<string>;
  delete(id: string): Promise<void>;
}

export interface AlbumPluginOptions {
  service: AlbumService;
}
