import type { Readable } from 'stream';
import type { Output } from 'valibot';
import type { CacheService, SongService } from './handler.mjs';
import type { AlbumExpandedSchema, AlbumSchema } from './schema.mjs';

export type Album = Output<typeof AlbumSchema>;

export interface AlbumService {
  // TODO: Type the constructor
  // constructor(storageService: StorageService): this;
  get(id: string): Promise<Output<typeof AlbumExpandedSchema>>;
  list(): Promise<Album[]>;
  create(payload: Omit<Album, 'id'>): Promise<string>;
  update(payload: Album): Promise<string>;
  delete(id: string): Promise<void>;
  setCover(id: string, image: Readable): Promise<void>;
  like(id: string, userId: string): Promise<void>;
  unlike(id: string, userId: string): Promise<void>;
  likesCount(id: string): Promise<number>;
}

export interface AlbumPluginOptions {
  service: AlbumService;
  songService: SongService;
  cacheService: CacheService;
}
