import { ClientError } from '../ClientError.mjs';

describe('ClientError', () => {
  it('should throw error when directly use it', () => {
    // @ts-expect-error client error direct usage is not allowed
    expect(() => new ClientError('')).toThrow('cannot instantiate abstract class');
  });
});
