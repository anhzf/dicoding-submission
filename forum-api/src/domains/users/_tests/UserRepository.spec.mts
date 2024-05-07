import UserRepository from '../UserRepository.mjs';

describe('UserRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    // @ts-expect-error
    const userRepository = new UserRepository();

    // Action and Assert
    expect(userRepository.create).toBeUndefined();
    expect(userRepository.verifyAvailableUsername).toBeUndefined();
    expect(userRepository.getPasswordByUsername).toBeUndefined();
    expect(userRepository.getIdByUsername).toBeUndefined();
  });
});
