// @ts-check
import { createClient } from 'redis';
import config from '../../config.mjs';
import CacheError from '../../errors/cache.mjs';
import { consola } from '../../utils/terminal.mjs';

/**
 * @typedef {import('./types').CacheService} Service
 */

/** @implements {Service} */
export default class CacheRedisService {
  #client = createClient({
    socket: {
      host: config.redis.server,
    },
  });

  constructor() {
    this.#client.on('error', (err) => {
      consola.error(err);
    });

    this.#client.connect();
  }

  /**
   * @param {string} key
   * @param {string} value
   * @param {number} [expirationInSecond=3600]
   */
  async set(key, value, expirationInSecond = 3600) {
    await this.#client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  /**
   * @param {string} key
   */
  async get(key) {
    const result = await this.#client.get(key);

    if (result === null) throw new CacheError();

    return result;
  }

  /**
   * @param {string} key
   */
  async delete(key) {
    await this.#client.del(key);
  }
}
