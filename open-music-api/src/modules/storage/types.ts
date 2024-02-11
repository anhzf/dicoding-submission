import { Readable } from 'stream';

export interface StorageService {
  upload(key: string, file: Readable): Promise<string>;
}
