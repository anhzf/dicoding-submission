import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.mjs';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.mjs';
import NotFoundError from '../../../commons/exceptions/NotFoundError.mjs';
import DetailThread from '../../../domains/threads/entities/DetailThread.mjs';
import InsertThread from '../../../domains/threads/entities/InsertThread.mjs';
import pool from '../../database/postgres/pool.mjs';
import ThreadRepositoryPostgres from '../ThreadRepositoryPostgres.mjs';

describe('ThreadRepositoryPostgres', () => {
  // Single source of truth
  const THREAD = Object.freeze({
    id: 'thread-123',
    owner: 'user-123',
    title: 'Hello, there!',
    body: 'Lorem ipsum dolor sit amet',
  });

  const { id, owner, title, body } = THREAD;

  const OWNER = {
    id: owner,
    username: 'dicoding',
  };

  beforeEach(async () => {
    await UsersTableTestHelper.add(OWNER);
  });

  afterEach(async () => {
    await Promise.all([
      UsersTableTestHelper.truncate(),
      ThreadsTableTestHelper.truncate(),
    ]);
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('.insert()', () => {
    it('should persist thread and return AddedThread correctly', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => '123');
      const thread = new InsertThread({
        ownerId: owner,
        title,
        body,
      });

      // Action
      const addedThread = await threadRepositoryPostgres.insert(thread);

      // Assert
      const threadInDatabase = await ThreadsTableTestHelper.get(addedThread.id);
      expect(addedThread.id).toEqual(threadInDatabase.id);
      expect(addedThread.owner).toEqual(threadInDatabase.owner);
      expect(addedThread.title).toEqual(threadInDatabase.title);
    });
  });

  describe('.isExist()', () => {
    it('should resolves if thread exists', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => '123');
      await ThreadsTableTestHelper.add(THREAD);

      // Action
      const result = threadRepositoryPostgres.isExist(id);

      // Assert
      await expect(result).resolves.not.toThrow();
    });

    it('should throws NotFoundError if thread does not exist', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => '123');

      // Action
      const result = threadRepositoryPostgres.isExist(id);

      // Assert
      await expect(result).rejects.toThrow(NotFoundError);
    });
  });

  describe('.get()', () => {
    it('should return DetailThread correctly', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => '123');
      const thread = await ThreadsTableTestHelper.add(THREAD);
      const expectedDetailThread = new DetailThread({
        id: thread.id,
        username: OWNER.username,
        title: thread.title,
        body: thread.body,
        date: thread.date,
      });

      // Action
      const detailThread = await threadRepositoryPostgres.get(id);

      // Assert
      expect(detailThread).toStrictEqual(expectedDetailThread);
    });

    it('should throw NotFoundError when thread is not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => '123');

      // Action & Assert
      await expect(threadRepositoryPostgres.get(id))
        .rejects.toThrow(NotFoundError);
    });
  });
});
