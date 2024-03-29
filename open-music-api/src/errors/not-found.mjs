import ClientError from './client.mjs';

export default class NotFoundError extends ClientError {
  /**
   *
   * @param {string} message
   */
  constructor(message) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}
