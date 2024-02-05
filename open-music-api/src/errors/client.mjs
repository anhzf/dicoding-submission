import { STATUS_CODE } from '../utils/http.mjs';

/**
 * @property {number} statusCode
 */
export default class ClientError extends Error {
  /**
   *
   * @param {string} message
   * @param {number | keyof typeof STATUS_CODE} code
   */
  constructor(message, code = STATUS_CODE.BAD_REQUEST) {
    super(message);
    this.name = 'ClientError';
    this.statusCode = code in STATUS_CODE ? STATUS_CODE[code] : code;
  }
}
