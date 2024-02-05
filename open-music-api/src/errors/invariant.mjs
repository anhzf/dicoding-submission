import ClientError from './client.mjs';

export default class InvariantError extends ClientError {
  /**
   *
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = 'InvariantError';
  }
}
