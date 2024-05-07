import { ClientError } from './ClientError.mjs';

export default class NotFoundError extends ClientError {
  constructor(message: string) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}
