import AuthenticationRepository from '../../../domains/authentications/AuthenticationRepository.mjs';
import NewAuth from '../../../domains/authentications/entities/NewAuth.mjs';
import UserRepository from '../../../domains/users/UserRepository.mjs';
import AuthenticationTokenManager from '../../security/AuthenticationTokenManager.mjs';
import PasswordHash from '../../security/PasswordHash.mjs';
import LoginUserUseCase from '../LoginUserUseCase.mjs';

describe('GetAuthenticationUseCase', () => {
  it('should orchestrating the get authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
    };
    const mockedAuthentication = new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });
    // @ts-expect-error for testing purpose
    const mockUserRepository = new UserRepository();
    // @ts-expect-error for testing purpose
    const mockAuthenticationRepository = new AuthenticationRepository();
    // @ts-expect-error for testing purpose
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    // @ts-expect-error for testing purpose
    const mockPasswordHash = new PasswordHash();

    // Mocking
    mockUserRepository.getPasswordByUsername = vitest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));

    mockPasswordHash.compare = vitest.fn()
      .mockImplementation(() => Promise.resolve());

    mockAuthenticationTokenManager.createAccessToken = vitest.fn()
      .mockImplementation(() => Promise.resolve(mockedAuthentication.accessToken));

    mockAuthenticationTokenManager.createRefreshToken = vitest.fn()
      .mockImplementation(() => Promise.resolve(mockedAuthentication.refreshToken));

    mockUserRepository.getIdByUsername = vitest.fn()
      .mockImplementation(() => Promise.resolve('user-123'));

    mockAuthenticationRepository.addToken = vitest.fn()
      .mockImplementation(() => Promise.resolve());

    // create use case instance
    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
    });

    // Action
    const actualAuthentication = await loginUserUseCase.execute(useCasePayload);

    // Assert
    expect(actualAuthentication).toEqual(new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    }));
    expect(mockUserRepository.getPasswordByUsername)
      .toBeCalledWith('dicoding');
    expect(mockPasswordHash.compare)
      .toBeCalledWith('secret', 'encrypted_password');
    expect(mockUserRepository.getIdByUsername)
      .toBeCalledWith('dicoding');
    expect(mockAuthenticationTokenManager.createAccessToken)
      .toBeCalledWith({ username: 'dicoding', id: 'user-123' });
    expect(mockAuthenticationTokenManager.createRefreshToken)
      .toBeCalledWith({ username: 'dicoding', id: 'user-123' });
    expect(mockAuthenticationRepository.addToken)
      .toBeCalledWith(mockedAuthentication.refreshToken);
  });
});
