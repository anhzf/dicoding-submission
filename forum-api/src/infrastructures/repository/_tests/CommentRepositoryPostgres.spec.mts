import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.mjs';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.mjs';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.mjs';
import AuthorizationError from '../../../commons/exceptions/AuthorizationError.mjs';
import NotFoundError from '../../../commons/exceptions/NotFoundError.mjs';
import DeleteComment from '../../../domains/comments/entities/DeleteComment.mjs';
import InsertComment from '../../../domains/comments/entities/InsertComment.mjs';
import pool from '../../database/postgres/pool.mjs';
import CommentRepositoryPostgres from '../CommentRepositoryPostgres.mjs';

describe('CommentRepositoryPostgres', () => {
  const COMMENT = Object.freeze({
    id: 'comment-123',
    content: 'content',
    userId: 'user-123',
    threadId: 'thread-123',
  });

  const { id, content, userId, threadId } = COMMENT;

  beforeEach(async () => {
    await UsersTableTestHelper.add({ id: userId });
    await ThreadsTableTestHelper.add({ id: threadId, owner: userId });
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
    it('should persist comment and return AddedComment correctly', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');
      const comment = new InsertComment({
        content,
        ownerId: userId,
        threadId,
      });

      // Action
      const addedComment = await commentRepositoryPostgres.insert(comment);

      // Assert
      const commentInDatabase = await CommentsTableTestHelper.get(id);
      expect(addedComment.id).toEqual(commentInDatabase.id);
      expect(addedComment.content).toEqual(commentInDatabase.content);
      expect(addedComment.ownerId).toEqual(commentInDatabase.user_id);
    });
  });

  describe('.isExist()', () => {
    it('should resolves if comment exists', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');
      await CommentsTableTestHelper.add(COMMENT);

      // Action
      const result = commentRepositoryPostgres.isExist(id);

      // Assert
      await expect(result).resolves.not.toThrowError();
    });

    it('should throws NotFoundError if comment does not exist', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');

      // Action
      const result = commentRepositoryPostgres.isExist(id);

      // Assert
      await expect(result).rejects.toThrowError(NotFoundError);
    });
  });

  describe('.isOwned()', () => {
    it('should resolves if comment is owned by user', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');
      await CommentsTableTestHelper.add(COMMENT);

      // Action
      const result = commentRepositoryPostgres.isOwned(id, userId);

      // Assert
      await expect(result).resolves.not.toThrowError();
    });

    it('should throws AuthorizationError if comment is not owned by user', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');
      await CommentsTableTestHelper.add(COMMENT);

      // Action
      const result = commentRepositoryPostgres.isOwned(id, 'user-456');

      // Assert
      await expect(result).rejects.toThrowError(AuthorizationError);
    });
  });

  describe('.destroy()', () => {
    it('should mark comment as deleted via soft delete', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');
      await CommentsTableTestHelper.add(COMMENT);
      const comment = new DeleteComment({
        commentId: id,
        threadId,
        ownerId: userId,
      });

      // Action
      await commentRepositoryPostgres.destroy(comment);

      // Assert
      const commentInDatabase = await CommentsTableTestHelper.get(id);
      expect(commentInDatabase.deleted_at).not.toBeNull();
    });
  });

  describe('.hasThreadOf()', () => {
    it('should return comments of thread correctly', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');
      await CommentsTableTestHelper.add(COMMENT);

      // Action
      const comments = await commentRepositoryPostgres.hasThreadOf(threadId);

      // Assert
      expect(comments).toHaveLength(1);
      expect(comments[0].id).toEqual(id);
    });
  });
})
