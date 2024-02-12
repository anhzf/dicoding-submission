export default class CacheError extends Error {
  /**
   *
   * @param {string?} message
   */
  constructor(message = 'Cache tidak ditemukan') {
    super(message);
    this.name = 'CacheError';
  }
}
