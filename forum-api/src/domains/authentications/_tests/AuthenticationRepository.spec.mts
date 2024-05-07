import AuthenticationRepository from '../AuthenticationRepository.mjs';

describe('AuthenticationRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    // @ts-expect-error
    const authenticationRepository = new AuthenticationRepository();

    // Action & Assert
    expect(authenticationRepository.addToken).toBeUndefined();
    expect(authenticationRepository.checkTokenAvailability).toBeUndefined();
    expect(authenticationRepository.deleteToken).toBeUndefined();
  });
});
