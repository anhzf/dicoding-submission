import type { Output } from 'valibot';
import type { SongDetailSchema } from './schema.mjs';

export type SongDetail = Output<typeof SongDetailSchema>;

export type Song = Output<typeof SongDetailSchema>;

export interface SongService {
  get(id: string): Promise<SongDetail>;
  list(): Promise<Song[]>;
  create(payload: Omit<SongDetail, 'id'>): Promise<string>;
  update(payload: Omit<SongDetail, 'id'>): Promise<string>;
  delete(id: string): Promise<void>;
}

export interface SongPluginOptions {
  service: SongService;
}

export interface SongQuery {
  title?: string;
  performer?: string;
}
