import type { ServerRoute } from '@hapi/hapi';
import { Readable } from 'stream';

export interface StorageService {
  readonly root: string;
  upload(key: string, file: Readable): Promise<string>;
  getUrl(key: string): string;
  getRoutes?(): ServerRoute[];
}
