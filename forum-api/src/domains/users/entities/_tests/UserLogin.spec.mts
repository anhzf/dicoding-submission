import UserLogin from '../UserLogin.mjs';

describe('UserLogin entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'dicoding',
    };

    // Action & Assert
    // @ts-expect-error for testing purpose
    expect(() => new UserLogin(payload)).toThrow(
      'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      password: 12345,
    };

    // Action & Assert
    // @ts-expect-error for testing purpose
    expect(() => new UserLogin(payload)).toThrow(
      'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create UserLogin entities correctly', () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      password: '12345',
    };

    // Action
    const userLogin = new UserLogin(payload);

    // Assert
    expect(userLogin).toBeInstanceOf(UserLogin);
    expect(userLogin.username).toEqual(payload.username);
    expect(userLogin.password).toEqual(payload.password);
  });
});
