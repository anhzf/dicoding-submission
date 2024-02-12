export interface CacheService {
  set(key: string, value: string, expirationInSecond?: number): Promise<void>;
  get(key: string): Promise<string>;
  delete(key: string): Promise<void>;
}
