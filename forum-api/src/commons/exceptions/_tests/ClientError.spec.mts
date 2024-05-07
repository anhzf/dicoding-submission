import { ClientError } from '../ClientError.mjs';

describe('ClientError', () => {
  it('should throw error when directly use it', () => {
    // @ts-expect-error
    expect(() => new ClientError('')).toThrowError('cannot instantiate abstract class');
  });
});
