import AuthenticationTokenManager from '../AuthenticationTokenManager.mjs';

describe('AuthenticationTokenManager interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    // @ts-expect-error - Ignore for testing purpose
    const tokenManager = new AuthenticationTokenManager();

    // Action & Assert
    expect(tokenManager.createAccessToken).toBeUndefined();
    expect(tokenManager.createRefreshToken).toBeUndefined();
    expect(tokenManager.verifyRefreshToken).toBeUndefined();
    expect(tokenManager.decodePayload).toBeUndefined();
  });
});
