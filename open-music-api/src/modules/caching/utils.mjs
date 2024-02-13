/**
 * @typedef {import('./types').CacheService} CacheService
 * @typedef {import('@hapi/hapi').Lifecycle.Method} Method
 * @typedef {import('@hapi/hapi').Request} HRequest
 * @typedef {import('@hapi/hapi').ResponseToolkit} HResponseToolkit
 */

import CacheError from '../../errors/cache.mjs';

/**
 * @template R
 * @param {CacheService} cacheService
 * @param {string | ((req: HRequest) => string)} getKey
 * @param {Method} handler
 * @param {{
 *  exp?: number;
 *  toSource?: (data: R) => string|number;
 *  fromSource?: (source: string|number) => R;
 * }} opts
 */
export const cacheResponsePayload = (cacheService, getKey, handler, {
  exp = 3600,
  fromSource = (source) => JSON.parse(source),
  toSource = (data) => JSON.stringify(data),
} = {}) => (
  /**
   * @param {HRequest} req
   * @param {HResponseToolkit} h
   */
  async (req, h) => {
    const key = typeof getKey === 'function' ? getKey(req) : getKey;
    try {
      const cached = await cacheService.get(key);
      return h.response(fromSource(cached))
        .header('X-Data-Source', 'cache')
        .header('X-Data-Source-Key', key);
    } catch (err) {
      if (err instanceof CacheError) {
        const response = await handler(req, h);
        await cacheService.set(key, toSource(response.source), exp);
        return response;
      }
      throw err;
    }
  }
);
