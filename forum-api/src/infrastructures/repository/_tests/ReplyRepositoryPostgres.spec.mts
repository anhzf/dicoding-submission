import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.mjs';
import RepliesTableTestHelper from '../../../../tests/RepliesTableTestHelper.mjs';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.mjs';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.mjs';
import DeleteReply from '../../../domains/replies/entities/DeleteReply.mjs';
import InsertReply from '../../../domains/replies/entities/InsertReply.mjs';
import pool from '../../database/postgres/pool.mjs';
import ReplyRepositoryPostgres from '../ReplyRepositoryPostgres.mjs';

describe('ReplyRepositoryPostgres', async () => {
  const REPLY = Object.freeze({
    id: 'reply-123',
    userId: 'user-123',
    threadId: 'thread-123',
    commentId: 'comment-123',
    content: 'Hello, there!',
  });

  const { id, userId, threadId, commentId, content } = REPLY;

  beforeEach(async () => {
    await UsersTableTestHelper.add({ id: userId });
    await ThreadsTableTestHelper.add({ id: threadId, owner: userId });
    await CommentsTableTestHelper.add({ id: commentId, userId, threadId });
  });

  afterEach(async () => {
    await Promise.all([
      UsersTableTestHelper.truncate(),
      ThreadsTableTestHelper.truncate(),
      CommentsTableTestHelper.truncate(),
      RepliesTableTestHelper.truncate(),
    ]);
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('.insert()', () => {
    it('should persist reply and return added reply correctly', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => '123');
      const reply = new InsertReply({
        userId,
        threadId,
        commentId,
        content,
      });

      // Action
      const addedReply = await replyRepositoryPostgres.insert(reply);

      // Assert
      const replyInDatabase = await RepliesTableTestHelper.get(addedReply.id);
      expect(addedReply.id).toEqual(replyInDatabase.id);
      expect(addedReply.owner).toEqual(replyInDatabase.user_id);
      expect(addedReply.content).toEqual(replyInDatabase.content);
    });
  });

  describe('.delete()', () => {
    it('should mark reply as deleted via soft delete', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => '123');
      await RepliesTableTestHelper.add(REPLY);
      const reply = new DeleteReply({
        id,
        userId,
        threadId,
        commentId,
      });

      // Action
      await replyRepositoryPostgres.delete(reply);

      // Assert
      const replyInDatabase = await RepliesTableTestHelper.get(id);
      expect(replyInDatabase.deleted_at).not.toBeNull();
    });
  });

  describe('.hasCommentOf()', () => {
    it('should return replies of comments correctly', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => '123');
      await RepliesTableTestHelper.add(REPLY);

      // Action
      const replies = await replyRepositoryPostgres.hasCommentOf(commentId);

      // Assert
      expect(replies).toHaveLength(1);
      expect(replies[0].id).toEqual(id);
    });
  });

  describe('.isExist()', () => {
    it('should return true when reply is exist', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => '123');
      await RepliesTableTestHelper.add(REPLY);

      // Action
      const isExist = await replyRepositoryPostgres.isExist(id);

      // Assert
      expect(isExist).toBe(true);
    });

    it('should return false when reply is not exist', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => '123');

      // Action
      const isExist = await replyRepositoryPostgres.isExist(id);

      // Assert
      expect(isExist).toBe(false);
    });
  });

  describe('.isOwned()', () => {
    it('should return true when reply is owned by user', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => '123');
      await RepliesTableTestHelper.add(REPLY);

      // Action
      const isOwned = await replyRepositoryPostgres.isOwned(id, userId);

      // Assert
      expect(isOwned).toBe(true);
    });

    it('should return false when reply is not owned by user', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => '123');
      await RepliesTableTestHelper.add(REPLY);

      // Action
      const isOwned = await replyRepositoryPostgres.isOwned(id, 'user-321');

      // Assert
      expect(isOwned).toBe(false);
    });
  });
});
