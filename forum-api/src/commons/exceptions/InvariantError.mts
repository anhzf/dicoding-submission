import { ClientError } from './ClientError.mjs';

export default class InvariantError extends ClientError {
  constructor(message: string) {
    super(message);
    this.name = 'InvariantError';
  }
}
