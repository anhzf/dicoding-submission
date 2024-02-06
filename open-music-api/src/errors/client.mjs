/**
 * @property {number} statusCode
 */
export default class ClientError extends Error {
  /**
   *
   * @param {string} message
   * @param {number} code
   */
  constructor(message, code = 400) {
    super(message);
    this.name = 'ClientError';
    this.statusCode = code;
  }
}
