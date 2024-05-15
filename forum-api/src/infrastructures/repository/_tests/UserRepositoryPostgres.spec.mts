import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.mjs';
import InvariantError from '../../../commons/exceptions/InvariantError.mjs';
import RegisterUser from '../../../domains/users/entities/RegisterUser.mjs';
import RegisteredUser from '../../../domains/users/entities/RegisteredUser.mjs';
import pool from '../../database/postgres/pool.mjs';
import UserRepositoryPostgres from '../UserRepositoryPostgres.mjs';

describe('UserRepositoryPostgres', () => {
  const USER = Object.freeze({
    id: 'user-123',
    username: 'dicoding',
    password: 'secret',
    fullname: 'Dicoding Indonesia',
  });

  const { id, username, password, fullname } = USER;

  afterEach(async () => {
    await UsersTableTestHelper.truncate();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('.verifyUsername()', () => {
    it('should throw InvariantError when username not available', async () => {
      // Arrange
      await UsersTableTestHelper.add(USER);
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, () => '123');

      // Action & Assert
      await expect(userRepositoryPostgres.verifyUsername(username)).rejects
        .toThrowError(InvariantError);
    });

    it('should not throw InvariantError when username available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, () => '123');

      // Action & Assert
      await expect(userRepositoryPostgres.verifyUsername('dicoding')).resolves
        .not.toThrowError(InvariantError);
    });
  });

  describe('.create()', () => {
    it('should persist register user and return registered user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username,
        password,
        fullname,
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await userRepositoryPostgres.create(registerUser);

      // Assert
      const user = await UsersTableTestHelper.get(id);
      expect(user).not.toBeUndefined();
    });

    it('should return registered user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username,
        password,
        fullname,
      });

      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredUser = await userRepositoryPostgres.create(registerUser);

      // Assert
      expect(registeredUser).toStrictEqual(new RegisteredUser(USER));
    });
  });

  describe('.getPasswordByUsername()', () => {
    it('should throw InvariantError when user not found', () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, () => '123');

      // Action & Assert
      return expect(userRepositoryPostgres.getPasswordByUsername(username))
        .rejects
        .toThrowError(InvariantError);
    });

    it('should return username password when user is found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, () => '123');
      await UsersTableTestHelper.add({
        username,
        password,
      });

      // Action & Assert
      const receivedPassword = await userRepositoryPostgres.getPasswordByUsername(username);
      expect(receivedPassword).toBe(password);
    });
  });

  describe('.getIdByUsername()', () => {
    it('should throw InvariantError when user not found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, () => '123');

      // Action & Assert
      await expect(userRepositoryPostgres.getIdByUsername(username))
        .rejects
        .toThrowError(InvariantError);
    });

    it('should return user id correctly', async () => {
      // Arrange
      const user = await UsersTableTestHelper.add(USER);
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, () => '123');

      // Action
      const userId = await userRepositoryPostgres.getIdByUsername(username);

      // Assert
      expect(userId).toEqual(user.id);
    });
  });
});
