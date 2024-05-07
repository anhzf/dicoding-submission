import UserRepository from '../../../domains/users/UserRepository.mjs';
import RegisterUser from '../../../domains/users/entities/RegisterUser.mjs';
import RegisteredUser from '../../../domains/users/entities/RegisteredUser.mjs';
import PasswordHash from '../../security/PasswordHash.mjs';
import AddUserUseCase from '../AddUserUseCase.mjs';

describe('AddUserUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };

    const mockRegisteredUser = new RegisteredUser({
      id: 'user-123',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
    });

    /** creating dependency of use case */
    // @ts-expect-error
    const mockUserRepository = new UserRepository();
    // @ts-expect-error
    const mockPasswordHash = new PasswordHash();

    /** mocking needed function */
    mockUserRepository.verifyUsername = vitest.fn()
      .mockImplementation(() => Promise.resolve());
    mockPasswordHash.hash = vitest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));
    mockUserRepository.create = vitest.fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredUser));

    /** creating use case instance */
    const getUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });

    // Action
    const registeredUser = await getUserUseCase.execute(useCasePayload);

    // Assert
    expect(registeredUser).toStrictEqual(new RegisteredUser({
      id: 'user-123',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
    }));

    expect(mockUserRepository.verifyUsername).toBeCalledWith(useCasePayload.username);
    expect(mockPasswordHash.hash).toBeCalledWith(useCasePayload.password);
    expect(mockUserRepository.create).toBeCalledWith(new RegisterUser({
      username: useCasePayload.username,
      password: 'encrypted_password',
      fullname: useCasePayload.fullname,
    }));
  });
});
