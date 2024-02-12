import { Readable } from 'stream';

export interface StorageUploadOptions {
  maxSize?: number;
}

export interface StorageService {
  upload(key: string, file: Readable, options?: StorageUploadOptions): Promise<string>;
}
