import CommentLikesTableTestHelper from '../../../../tests/CommentLikesTableTestHelper.mjs';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.mjs';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.mjs';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.mjs';
import NotFoundError from '../../../commons/exceptions/NotFoundError.mjs';
import CommentLike from '../../../domains/commentLikes/entities/CommentLike.mjs';
import GetCommentLikesCount from '../../../domains/commentLikes/entities/GetCommentLikesCount.mjs';
import SetCommentLike from '../../../domains/commentLikes/entities/SetCommentLike.mjs';
import pool from '../../database/postgres/pool.mjs';
import CommentLikeRepositoryPostgres from '../CommentLikeRepositoryPostgres.mjs';

describe('CommentLikeRepositoryPostgres', () => {
  const threadId = 'thread-123';
  const COMMENT_LIKE = Object.freeze({
    commentId: 'comment-123',
    userId: 'user-123',
  });

  const idGenerator = () => '123';

  const { userId, commentId } = COMMENT_LIKE;

  beforeEach(async () => {
    await UsersTableTestHelper.add({ id: userId });
    await ThreadsTableTestHelper.add({ id: threadId, owner: userId });
    await CommentsTableTestHelper.add({ id: commentId, threadId, userId });
  });

  afterEach(async () => {
    await Promise.all([
      UsersTableTestHelper.truncate(),
      ThreadsTableTestHelper.truncate(),
      CommentsTableTestHelper.truncate(),
      CommentLikesTableTestHelper.truncate(),
    ]);
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('.isExist()', () => {
    it('should resolves if comment like exists', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, idGenerator);
      await CommentLikesTableTestHelper.add(COMMENT_LIKE);

      // Action
      const result = commentLikeRepositoryPostgres.isExist(new CommentLike(COMMENT_LIKE));

      // Assert
      await expect(result).resolves.not.toThrow(NotFoundError);
    });

    it('should throws NotFoundError if comment like does not exist', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, idGenerator);

      // Action
      const result = commentLikeRepositoryPostgres.isExist(new CommentLike(COMMENT_LIKE));

      // Assert
      await expect(result).rejects.toThrow(NotFoundError);
    });
  });

  describe('.set()', () => {
    it('should persist set comment like', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, idGenerator);

      // Action
      await commentLikeRepositoryPostgres.set(new SetCommentLike(COMMENT_LIKE));

      // Assert
      await expect(commentLikeRepositoryPostgres.isExist(new CommentLike(COMMENT_LIKE)))
        .resolves.not.toThrow();
    });
  });

  describe('.unset()', () => {
    it('should persist unset comment like', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, idGenerator);
      await CommentLikesTableTestHelper.add(COMMENT_LIKE);

      // Action
      await commentLikeRepositoryPostgres.unset(new SetCommentLike(COMMENT_LIKE));

      // Assert
      await expect(commentLikeRepositoryPostgres.isExist(new CommentLike(COMMENT_LIKE)))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('.countByComment()', () => {
    it('should return comment likes count correctly', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, idGenerator);
      await CommentLikesTableTestHelper.add(COMMENT_LIKE);

      // Action
      const commentLikesCount = await commentLikeRepositoryPostgres.countByComment(COMMENT_LIKE.commentId);

      // Assert
      expect(commentLikesCount).toStrictEqual(new GetCommentLikesCount({
        commentId: COMMENT_LIKE.commentId,
        count: 1,
      }));
    });
  });
});
