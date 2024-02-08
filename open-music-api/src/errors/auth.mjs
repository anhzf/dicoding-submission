import ClientError from './client.mjs';

export default class AuthError extends ClientError {
  constructor(message) {
    super(message, 401);
    this.name = 'AuthError';
  }
}
