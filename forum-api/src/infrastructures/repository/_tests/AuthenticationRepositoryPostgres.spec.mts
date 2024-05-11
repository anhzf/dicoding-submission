import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper.mjs';
import InvariantError from '../../../commons/exceptions/InvariantError.mjs';
import pool from '../../database/postgres/pool.mjs';
import AuthenticationRepositoryPostgres from '../AuthenticationRepositoryPostgres.mjs';

describe('AuthenticationRepositoryPostgres', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.truncate();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('.addToken()', () => {
    it('should add token to database', async () => {
      // Arrange
      const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
      const token = 'token';

      // Action
      await authenticationRepository.addToken(token);

      // Assert
      const tokens = await AuthenticationsTableTestHelper.get(token);
      expect(tokens).toHaveLength(1);
      expect(tokens[0].token).toBe(token);
    });
  });

  describe('.checkTokenAvailability()', () => {
    it('should throw InvariantError if token not available', async () => {
      // Arrange
      const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
      const token = 'token';

      // Action & Assert
      await expect(authenticationRepository.checkTokenAvailability(token))
        .rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError if token available', async () => {
      // Arrange
      const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
      const token = 'token';
      await AuthenticationsTableTestHelper.add(token);

      // Action & Assert
      await expect(authenticationRepository.checkTokenAvailability(token))
        .resolves.not.toThrow(InvariantError);
    });
  });

  describe('.deleteToken()', () => {
    it('should delete token from database', async () => {
      // Arrange
      const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
      const token = 'token';
      await AuthenticationsTableTestHelper.add(token);

      // Action
      await authenticationRepository.deleteToken(token);

      // Assert
      const tokens = await AuthenticationsTableTestHelper.get(token);
      expect(tokens).toHaveLength(0);
    });
  });
});
