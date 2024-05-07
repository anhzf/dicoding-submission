import AuthenticationRepository from '../../../domains/authentications/AuthenticationRepository.mjs';
import DeleteAuthenticationUseCase from '../DeleteAuthenticationUseCase.mjs';

describe('DeleteAuthenticationUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    // Arrange
    const useCasePayload = {};
    // @ts-expect-error
    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({});

    // Action & Assert
    // @ts-expect-error
    await expect(deleteAuthenticationUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
  });

  it('should throw error if refresh token not string', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 123,
    };
    // @ts-expect-error
    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({});

    // Action & Assert
    // @ts-expect-error
    await expect(deleteAuthenticationUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refreshToken',
    };
    // @ts-expect-error
    const mockAuthenticationRepository = new AuthenticationRepository();
    mockAuthenticationRepository.checkTokenAvailability = vitest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationRepository.deleteToken = vitest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
    });

    // Act
    await deleteAuthenticationUseCase.execute(useCasePayload);

    // Assert
    expect(mockAuthenticationRepository.checkTokenAvailability)
      .toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationRepository.deleteToken)
      .toHaveBeenCalledWith(useCasePayload.refreshToken);
  });
});
