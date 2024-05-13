import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.mjs';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.mjs';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.mjs';
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

    it('should throw NotFoundError when inserting comment with unavailable thread', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');
      const comment = new InsertComment({
        content,
        ownerId: userId,
        threadId: 'thread-456',
      });

      // Action & Assert
      await expect(commentRepositoryPostgres.insert(comment))
        .rejects.toThrowError(NotFoundError);
    });

    // it('should throw Error when inserting comment with invalid input', async () => {
    //   // Arrange
    //   const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');
    //   const comment = new InsertComment({
    //     content: '',
    //     ownerId: userId,
    //     threadId,
    //   });
    //   // @ts-expect-error
    //   comment.content = new Date();

    //   // Action & Assert
    //   await expect(commentRepositoryPostgres.insert(comment))
    //     .rejects.toThrowError();
    // });
  });

  describe('.isExist()', () => {
    it('should return true if comment exists', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');
      await CommentsTableTestHelper.add(COMMENT);

      // Action
      const isExist = await commentRepositoryPostgres.isExist(id);

      // Assert
      expect(isExist).toBe(true);
    });

    it('should return false if comment does not exist', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');

      // Action
      const isExist = await commentRepositoryPostgres.isExist(id);

      // Assert
      expect(isExist).toBe(false);
    });
  });

  describe('.isOwned()', () => {
    it('should return true if comment is owned by user', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');
      await CommentsTableTestHelper.add(COMMENT);

      // Action
      const isOwned = await commentRepositoryPostgres.isOwned(id, userId);

      // Assert
      expect(isOwned).toBe(true);
    });

    it('should return false if comment is not owned by user', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');
      await CommentsTableTestHelper.add(COMMENT);

      // Action
      const isOwned = await commentRepositoryPostgres.isOwned(id, 'user-456');

      // Assert
      expect(isOwned).toBe(false);
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
