import AuthorizationError from '../AuthorizationError.mjs';
import { ClientError } from '../ClientError.mjs';

describe('AuthorizationError', () => {
  it('should create AuthorizationError correctly', () => {
    const authorizationError = new AuthorizationError('authentication error!');

    expect(authorizationError).toBeInstanceOf(AuthorizationError);
    expect(authorizationError).toBeInstanceOf(ClientError);
    expect(authorizationError).toBeInstanceOf(Error);

    expect(authorizationError.statusCode).toEqual(403);
    expect(authorizationError.message).toEqual('authentication error!');
    expect(authorizationError.name).toEqual('AuthorizationError');
  });
});
